import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { Image, Text, View } from 'react-native';
import { colors, glow } from '../theme/tokens';

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
  return (
    <View
      className={`flex-1 gap-2 rounded-md border-[1.5px] bg-surface p-2 ${
        locked ? 'border-disabled' : 'border-primary'
      }`}
      style={{ boxShadow: locked ? glow.card : glow.primary }}>
      <View className="aspect-square items-center justify-center overflow-hidden rounded-sm bg-canvas">
        {locked ? (
          <Text className="font-data-black text-h1 text-disabled-text">???</Text>
        ) : imageUrl ? (
          <Image source={{ uri: imageUrl }} className="h-full w-full" accessibilityLabel={title} />
        ) : (
          <MaterialDesignIcons name="nfc-variant" size={40} color={colors.primary} />
        )}
      </View>
      <Text numberOfLines={2} className={`font-body-semibold text-caption ${locked ? 'text-ink/60' : 'text-ink'}`}>
        {locked ? 'Sin descubrir' : title}
      </Text>
      {!!subtitle && subtitle !== title && !locked && (
        <Text numberOfLines={1} className="font-body text-caption text-ink/60">
          {subtitle}
        </Text>
      )}
      <Text className={`font-data text-overline uppercase ${locked ? 'text-disabled-text' : 'text-primary'}`}>
        +{points} pts
      </Text>
    </View>
  );
}
