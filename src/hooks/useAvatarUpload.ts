import { useState } from 'react';
import { Platform } from 'react-native';
import { uploadAvatar } from '@/api/profile';
import { pickAvatar } from '@/utils/avatar';
import { hapticError, hapticSuccess } from '@/utils/haptics';

/**
 * Cambiar la foto de perfil: elegirla (galería o cámara), comprimirla y
 * subirla. `onChanged` recibe la ruta nueva. En web no hay cámara de fotos
 * del sistema: `canUseCamera` es false.
 */
export function useAvatarUpload(onChanged: (avatarUrl: string | null) => void) {
  const [isUploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const change = async (source: 'library' | 'camera') => {
    if (isUploading) return;
    setError(null);
    try {
      const uri = await pickAvatar(source);
      if (!uri) return;
      setUploading(true);
      onChanged((await uploadAvatar(uri)).avatarUrl);
      hapticSuccess();
    } catch (failure) {
      hapticError();
      setError((failure as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return { change, isUploading, error, canUseCamera: Platform.OS !== 'web' };
}
