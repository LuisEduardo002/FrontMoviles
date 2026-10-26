import { useState } from 'react';
import { hapticError, hapticTap } from '@/utils/haptics';

/**
 * La caja de texto del chat: el borrador y el envío. Si el mensaje no sale,
 * el texto vuelve a la caja para no perderlo y el motivo queda en `error`.
 */
export function useChatComposer(send: (content: string) => Promise<string | null>) {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    const content = draft.trim();
    if (!content) return;
    hapticTap();
    setDraft('');
    const failure = await send(content);
    if (failure) {
      hapticError();
      setDraft(content);
    }
    setError(failure);
  };

  return { draft, setDraft, submit, canSend: !!draft.trim(), error, setError };
}
