import { Image, Text, View } from 'react-native';
import { assetUrl } from '../config/env';
import { glow } from '../theme/tokens';

/**
 * Foto de perfil. Sin foto, la inicial del apodo sobre fondo cian.
 * `highlight` le pone el borde neón (el perfil propio, el primer puesto).
 */
const SIZE = {
  sm: { box: 'h-[36px] w-[36px]', text: 'text-body' },
  md: { box: 'h-[44px] w-[44px]', text: 'text-h3' },
  lg: { box: 'h-[96px] w-[96px]', text: 'text-h1' },
} as const;

export default function Avatar({
  nickname,
  url,
  size = 'md',
  highlight,
}: {
  nickname: string;
  url: string | null;
  size?: keyof typeof SIZE;
  highlight?: boolean;
}) {
  const uri = assetUrl(url);

  return (
    <View
      className={`items-center justify-center overflow-hidden rounded-full bg-secondary/15 ${SIZE[size].box} ${
        highlight ? 'border-2 border-primary' : ''
      }`}
      style={highlight ? { boxShadow: glow.primary } : undefined}>
      {uri ? (
        <Image source={{ uri }} className="h-full w-full" accessibilityLabel={`Foto de ${nickname}`} />
      ) : (
        <Text className={`font-data uppercase text-secondary ${SIZE[size].text}`}>
          {nickname.charAt(0)}
        </Text>
      )}
    </View>
  );
}
