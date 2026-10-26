import { View } from 'react-native';
import Avatar from '@/components/ui/Avatar';
import Notice from '@/components/ui/Notice';
import { Chip } from '@/components/ui/Segmented';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import type { MyProfile } from '@/types';

/**
 * La foto de perfil con sus dos formas de cambiarla. La subida vive en
 * `useAvatarUpload`; en web solo aparece "Galería".
 */
export default function AvatarEditor({
  profile,
  onChanged,
}: {
  profile: Pick<MyProfile, 'nickname' | 'avatarUrl'>;
  /** Recibe la ruta de la foto nueva. */
  onChanged: (avatarUrl: string | null) => void;
}) {
  const { change, isUploading, error, canUseCamera } = useAvatarUpload(onChanged);

  return (
    <View className="items-center gap-3">
      <Avatar nickname={profile.nickname} url={profile.avatarUrl} size="lg" highlight />
      <View className="flex-row gap-2">
        <Chip label={isUploading ? 'Subiendo…' : 'Galería'} selected={false} onPress={() => void change('library')} />
        {canUseCamera && <Chip label="Cámara" selected={false} onPress={() => void change('camera')} />}
      </View>
      <Notice message={error} />
    </View>
  );
}
