import { Image, Text, View } from 'react-native';
import { assetUrl } from '@/config/env';
import { AvatarToken } from '@/theme/Token';
import { glow } from '@/theme/tokens';

/**
 * Foto de perfil. Sin foto, la inicial del apodo sobre fondo cian.
 * `highlight` le pone el borde neón (el perfil propio, el primer puesto).
 */
export default function Avatar({
  nickname,
  url,
  size = 'md',
  highlight,
}: {
  nickname: string;
  url: string | null;
  size?: keyof typeof AvatarToken.size;
  highlight?: boolean;
}) {
  const uri = assetUrl(url);

  return (
    <View
      className={`${AvatarToken.container} ${AvatarToken.size[size].box} ${
        highlight ? AvatarToken.highlight : ''
      }`}
      style={highlight ? { boxShadow: glow.primary } : undefined}>
      {uri ? (
        <Image source={{ uri }} className={AvatarToken.image} accessibilityLabel={`Foto de ${nickname}`} />
      ) : (
        <Text className={`${AvatarToken.initial} ${AvatarToken.size[size].text}`}>
          {nickname.charAt(0)}
        </Text>
      )}
    </View>
  );
}
