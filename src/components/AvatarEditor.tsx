import { useState } from 'react';
import { Platform, View } from 'react-native';
import { uploadAvatar } from '../api/profile';
import type { MyProfile } from '../types';
import { pickAvatar } from '../utils/avatar';
import { hapticError, hapticSuccess } from '../utils/haptics';
import Avatar from './Avatar';
import Notice from './Notice';
import { Chip } from './Segmented';

/**
 * La foto de perfil con sus dos formas de cambiarla. En web no hay cámara de
 * fotos del sistema, así que ahí solo aparece "Galería".
 */
export default function AvatarEditor({
  profile,
  onChanged,
}: {
  profile: Pick<MyProfile, 'nickname' | 'avatarUrl'>;
  /** Recibe la ruta de la foto nueva. */
  onChanged: (avatarUrl: string | null) => void;
}) {
  const [isUploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const change = async (source: 'library' | 'camera') => {
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

  return (
    <View className="items-center gap-3">
      <Avatar nickname={profile.nickname} url={profile.avatarUrl} size="lg" highlight />
      <View className="flex-row gap-2">
        <Chip
          label={isUploading ? 'Subiendo…' : 'Galería'}
          selected={false}
          onPress={() => !isUploading && void change('library')}
        />
        {Platform.OS !== 'web' && (
          <Chip label="Cámara" selected={false} onPress={() => !isUploading && void change('camera')} />
        )}
      </View>
      <Notice message={error} />
    </View>
  );
}
