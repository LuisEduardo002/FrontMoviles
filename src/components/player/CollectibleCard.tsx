import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { Image, Text, View } from 'react-native';
import { CollectibleCardToken } from '@/theme/Token';
import { colors, glow } from '@/theme/tokens';

/**
 * Una carta del álbum. Encontrada: su imagen (o el ícono NFC), título y
 * puntos, con resplandor verde. Pendiente: una silueta "???" que invita a
 * salir a buscarla.
 */
export default function CollectibleCard({
  title,
  subtitle,
  imageUrl,
  points,
  locked,
}: {
  title: string;
  subtitle?: string;
  imageUrl?: string | null;
  points: number;
  locked?: boolean;
}) {
  const state = locked ? 'locked' : 'found';

  return (
    <View
      className={`${CollectibleCardToken.container} ${CollectibleCardToken.border[state]}`}
      style={{ boxShadow: locked ? glow.card : glow.primary }}>
      <View className={CollectibleCardToken.imageWrapper}>
        {locked ? (
          <Text className={CollectibleCardToken.lockedMark}>???</Text>
        ) : imageUrl ? (
          <Image source={{ uri: imageUrl }} className={CollectibleCardToken.image} accessibilityLabel={title} />
        ) : (
          <MaterialDesignIcons name="nfc-variant" size={CollectibleCardToken.iconSize} color={colors.primary} />
        )}
      </View>
      <Text numberOfLines={2} className={`${CollectibleCardToken.title} ${CollectibleCardToken.titleColor[state]}`}>
        {locked ? 'Sin descubrir' : title}
      </Text>
      {!!subtitle && subtitle !== title && !locked && (
        <Text numberOfLines={1} className={CollectibleCardToken.subtitle}>
          {subtitle}
        </Text>
      )}
      <Text className={`${CollectibleCardToken.points} ${CollectibleCardToken.pointsColor[state]}`}>
        +{points} pts
      </Text>
    </View>
  );
}
