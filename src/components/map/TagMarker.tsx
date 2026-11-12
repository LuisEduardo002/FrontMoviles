import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { View } from 'react-native';
import { Marker } from 'react-native-maps';
import { TagMarkerToken } from '@/theme/Token';
import { colors } from '@/theme/tokens';
import type { PlayerTag } from '@/types';

/**
 * Pin de un tag en el mapa. `tracksViewChanges={false}` evita que Android
 * vuelva a rasterizar la vista en cada frame, porque el contenido es estático.
 *
 * `stopPropagation` evita que, en iOS con Apple Maps, el toque del marcador
 * también cierre la ficha al llegar al `onPress` del mapa.
 */
export default function TagMarker({
  tag,
  onPress,
}: {
  tag: PlayerTag & { latitude: number; longitude: number };
  onPress: (tag: PlayerTag) => void;
}) {
  const tone = tag.foundByMe ? 'found' : 'pending';

  return (
    <Marker
      coordinate={{ latitude: tag.latitude, longitude: tag.longitude }}
      onPress={() => onPress(tag)}
      tracksViewChanges={false}
      stopPropagation
      anchor={{ x: 0.5, y: 0.5 }}
      accessibilityLabel={`${tag.name}, ${tag.pointsReward} puntos`}>
      <View className={`${TagMarkerToken.container} ${TagMarkerToken.border[tone]}`}>
        <MaterialDesignIcons
          name={tag.foundByMe ? 'check' : 'nfc-variant'}
          size={TagMarkerToken.iconSize}
          color={tag.foundByMe ? colors.secondary : colors.primary}
        />
      </View>
    </Marker>
  );
}
