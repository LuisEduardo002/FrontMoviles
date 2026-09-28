/**
 * Chat en vivo. Dos canales:
 * - REST para lo que no es tiempo real: salas e historial.
 * - socket.io (namespace /chat) para enviar y recibir al instante. El socket
 *   se autentica con el mismo JWT de la sesión.
 */

import { io, type Socket } from 'socket.io-client';
import { API_URL } from '../config/env';
import type { ChatMessage, ChatRoom } from '../types';
import { request } from './client';

export function listRooms(): Promise<ChatRoom[]> {
  return request<ChatRoom[]>('/chat/rooms');
}

/** Del más nuevo al más viejo; `before` trae los anteriores a esa fecha. */
export function listMessages(room: string, before?: string): Promise<ChatMessage[]> {
  const query = before ? `?before=${encodeURIComponent(before)}` : '';
  return request<ChatMessage[]>(`/chat/${encodeURIComponent(room)}/messages${query}`);
}

/** Moderación (solo ADMIN): el mensaje desaparece en vivo para todos. */
export async function deleteMessage(id: string): Promise<void> {
  await request<unknown>(`/chat/messages/${id}`, undefined, 'DELETE');
}

/** Respuesta del servidor a join/send: si pasó y, si no, por qué. */
export type ChatAck<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

export function connectChat(token: string): Socket {
  return io(`${API_URL}/chat`, {
    auth: { token },
    // Sin long-polling: en Expo Go y en web el WebSocket directo es más estable
    transports: ['websocket'],
  });
}

/** Emite y espera la respuesta del servidor, con un tope para no colgarse. */
export function emitWithAck<T>(socket: Socket, event: string, body: unknown): Promise<ChatAck<T>> {
  return socket
    .timeout(8000)
    .emitWithAck(event, body)
    .catch(() => ({ ok: false as const, error: 'El chat no respondió. Revisa tu conexión.' }));
}

/** La sala donde hablan todos los jugadores. */
export const GENERAL_ROOM = 'general';
