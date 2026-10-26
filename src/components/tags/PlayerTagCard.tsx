import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { Text, View } from 'react-native';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Body, Caption, Heading } from '@/components/ui/Typography';
import { colors } from '@/theme/tokens';
import type { PlayerTag } from '@/types';
import { formatDateTime } from '@/utils/format';
import { openInMaps } from '@/utils/maps';

/**
 * Un tag visto por el jugador. Los visibles traen "Cómo llegar" mientras se
 * puedan cazar; los ocultos, solo su pista.
 */
export default function PlayerTagCard({ tag, canHunt }: { tag: PlayerTag; canHunt: boolean }) {
  const hasLocation = tag.latitude != null && tag.longitude != null;

  return (
    <Card>
      <View className="flex-row items-start gap-2">
        <Heading level="h3" className="flex-1" numberOfLines={2}>
          {tag.name}
        </Heading>
        <Badge text={`+${tag.pointsReward} pts`} tone={tag.foundByMe ? 'muted' : 'primary'} />
      </View>
      <View className="flex-row flex-wrap gap-2">
        {tag.foundByMe && <Badge text="Encontrado" tone="primary" />}
        {tag.isHidden && <Badge text="Oculto" tone="secondary" />}
      </View>
      {!!tag.description && <Body muted>{tag.description}</Body>}
      {!!tag.clueText && (
        <View className="flex-row gap-2 rounded-sm bg-secondary/10 p-2">
          <MaterialDesignIcons name="lightbulb-on-outline" size={18} color={colors.secondary} />
          <Text className="flex-1 font-body text-body text-secondary">{tag.clueText}</Text>
        </View>
      )}
      {tag.foundByMe && !!tag.foundAt && <Caption>Lo encontraste el {formatDateTime(tag.foundAt)}</Caption>}
      {!tag.foundByMe && canHunt && hasLocation && (
        <Button
          text="Cómo llegar"
          icon="map-marker-radius"
          variant="secondary"
          onPress={() => openInMaps(tag.latitude as number, tag.longitude as number, tag.name)}
        />
      )}
    </Card>
  );
}
