import { useState } from 'react';
import { useRole } from '@/hooks/useRole';
import type { ChatMessage } from '@/types';
import { confirmDestructive } from '@/utils/dialog';

/**
 * Moderación del chat: solo el admin puede borrar mensajes, tras confirmar.
 * `moderate` es undefined para los jugadores, así la burbuja no reacciona
 * a la pulsación larga.
 */
export function useChatModeration(remove: (id: string) => Promise<void>) {
  const { isAdmin } = useRole();
  const [error, setError] = useState<string | null>(null);

  const moderate = async (message: ChatMessage) => {
    const confirmed = await confirmDestructive(
      'Borrar mensaje',
      `¿Borrar el mensaje de ${message.user.nickname}? Desaparece para todos.`,
      'Borrar',
    );
    if (!confirmed) return;
    try {
      await remove(message.id);
    } catch (failure) {
      setError((failure as Error).message);
    }
  };

  return { moderate: isAdmin ? moderate : undefined, error };
}
