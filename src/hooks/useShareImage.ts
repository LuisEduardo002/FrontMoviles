import * as Sharing from 'expo-sharing';
import { useRef, useState } from 'react';
import { Platform, type View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { hapticError, hapticSuccess } from '@/utils/haptics';

/**
 * Convierte una vista en imagen y abre el menú de compartir del celular.
 * Se usa para la tarjeta de cazador y para el QR de un tag.
 *
 * `ref` va en la vista a capturar (con `collapsable={false}`, que Android
 * necesita). En web no hay captura ni menú de compartir: `canShare` es false.
 */
export function useShareImage(dialogTitle: string) {
  const ref = useRef<View>(null);
  const [isSharing, setSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canShare = Platform.OS !== 'web';

  const share = async () => {
    setError(null);
    if (!canShare || !(await Sharing.isAvailableAsync())) {
      setError('Compartir funciona desde la app en el celular.');
      return;
    }
    try {
      setSharing(true);
      const uri = await captureRef(ref, { format: 'png', quality: 1 });
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle });
      hapticSuccess();
    } catch (failure) {
      hapticError();
      setError((failure as Error).message);
    } finally {
      setSharing(false);
    }
  };

  return { ref, share, isSharing, error, canShare };
}
