import { Text, View } from 'react-native';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { Caption, Heading } from '@/components/ui/Typography';
import type { NfcTag } from '@/types';

/** Un tag en la lista del admin: código, nombre, puntos, visibilidad y evento. */
export default function TagCard({
  tag,
  eventName,
  onOpen,
}: {
  tag: NfcTag;
  eventName?: string;
  onOpen: () => void;
}) {
  return (
    <Card onPress={onOpen}>
      <Text className="font-data text-overline uppercase text-secondary">{tag.code}</Text>
      <Heading level="h3" numberOfLines={2}>
        {tag.name}
      </Heading>
      <View className="flex-row flex-wrap gap-2">
        <Badge text={`+${tag.pointsReward} pts`} tone="primary" />
        {tag.isHidden && <Badge text="Oculto" />}
        {!!eventName && <Badge text={eventName} tone="secondary" />}
      </View>
      <Caption>
        {tag.latitude.toFixed(5)}, {tag.longitude.toFixed(5)}
      </Caption>
    </Card>
  );
}
