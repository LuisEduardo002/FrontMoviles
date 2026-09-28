import { useCallback, useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { connectChat, deleteMessage, emitWithAck, listMessages } from '../api/chat';
import { useSession } from '../session/context';
import type { ChatMessage } from '../types';

const PAGE_SIZE = 50;

/** Agrega sin duplicar y deja la lista del más nuevo al más viejo. */
function merge(current: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] {
  const byId = new Map(current.map((message) => [message.id, message]));
  for (const message of incoming) byId.set(message.id, message);
  return [...byId.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * Una sala del chat: historial por REST y mensajes nuevos por el socket.
 *
 * La lista va del más nuevo al más viejo porque la pantalla la pinta con una
 * FlatList invertida (el último mensaje abajo, junto al teclado). Al
 * reconectarse vuelve a pedir el historial reciente: los mensajes que llegaron
 * mientras no había señal no se pierden.
 */
export function useChatRoom(room: string) {
  const { token } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isConnected, setConnected] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const loadingOlder = useRef(false);

  useEffect(() => {
    if (!token) return;
    let active = true;

    const loadRecent = async () => {
      try {
        const recent = await listMessages(room);
        if (!active) return;
        setMessages((current) => merge(current, recent));
        setHasMore(recent.length === PAGE_SIZE);
        setError(null);
      } catch (failure) {
        if (active) setError((failure as Error).message);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadRecent();
    const socket = connectChat(token);
    socketRef.current = socket;
    let firstConnection = true;

    socket.on('connect', async () => {
      const ack = await emitWithAck(socket, 'join', { room });
      if (!active) return;
      if (!ack.ok) {
        setError(ack.error);
        return;
      }
      setConnected(true);
      if (!firstConnection) void loadRecent();
      firstConnection = false;
    });
    socket.on('disconnect', () => active && setConnected(false));
    socket.on('message', (message: ChatMessage) => {
      if (active && message.room === room) setMessages((current) => merge(current, [message]));
    });
    socket.on('deleted', ({ id }: { id: string }) => {
      if (active) setMessages((current) => current.filter((message) => message.id !== id));
    });
    socket.on('session_error', ({ message }: { message: string }) => active && setError(message));

    return () => {
      active = false;
      socket.disconnect();
      socketRef.current = null;
    };
  }, [room, token]);

  /** Devuelve null si se envió, o el motivo por el que no. */
  const send = useCallback(
    async (content: string): Promise<string | null> => {
      const socket = socketRef.current;
      if (!socket?.connected) return 'Sin conexión con el chat. Reintentando…';
      const ack = await emitWithAck<ChatMessage>(socket, 'send', { room, content });
      if (!ack.ok) return ack.error;
      if (ack.data) setMessages((current) => merge(current, [ack.data as ChatMessage]));
      return null;
    },
    [room],
  );

  /** Trae la página anterior al mensaje más viejo que se tiene. */
  const loadOlder = useCallback(async () => {
    const oldest = messages[messages.length - 1];
    if (!oldest || !hasMore || loadingOlder.current) return;
    loadingOlder.current = true;
    try {
      const older = await listMessages(room, oldest.createdAt);
      setMessages((current) => merge(current, older));
      setHasMore(older.length === PAGE_SIZE);
    } catch {
      // Se reintenta en el siguiente scroll
    } finally {
      loadingOlder.current = false;
    }
  }, [messages, hasMore, room]);

  const remove = useCallback(async (id: string) => {
    await deleteMessage(id);
    setMessages((current) => current.filter((message) => message.id !== id));
  }, []);

  return { messages, isLoading, isConnected, error, send, loadOlder, remove };
}
