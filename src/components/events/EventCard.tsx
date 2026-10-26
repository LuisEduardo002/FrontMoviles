import { View } from 'react-native';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { Body, Caption, Heading } from '@/components/ui/Typography';
import type { AdminEvent } from '@/types';
import { formatDate } from '@/utils/format';

/** Un evento en la lista del admin: nombre, estado, fechas y descripción. */
export default function EventCard({ event, onOpen }: { event: AdminEvent; onOpen: () => void }) {
  return (
    <Card onPress={onOpen}>
      <View className="flex-row items-start gap-2">
        <Heading level="h3" className="flex-1" numberOfLines={2}>
          {event.name}
        </Heading>
        <Badge text={event.isActive ? 'Activo' : 'Inactivo'} tone={event.isActive ? 'primary' : 'muted'} />
      </View>
      <Caption>
        {formatDate(event.startDate)} → {formatDate(event.endDate)}
      </Caption>
      {!!event.description && (
        <Body muted numberOfLines={2}>
          {event.description}
        </Body>
      )}
    </Card>
  );
}
