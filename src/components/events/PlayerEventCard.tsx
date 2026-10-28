import { View } from 'react-native';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { Body, Caption, Heading } from '@/components/ui/Typography';
import type { EventProgress } from '@/hooks/usePlayerEvents';
import type { AdminEvent } from '@/types';
import { eventPhase, PHASE_LABEL, PHASE_TONE } from '@/utils/events';
import { formatDateTime } from '@/utils/format';

/** Un evento en la lista del jugador: momento, horario y su progreso en él. */
export default function PlayerEventCard({
  event,
  progress,
  onOpen,
}: {
  event: AdminEvent;
  progress?: EventProgress;
  onOpen: () => void;
}) {
  const phase = eventPhase(event);

  return (
    <Card onPress={onOpen}>
      <View className="flex-row items-start gap-2">
        <Heading level="h3" className="flex-1" numberOfLines={2}>
          {event.name}
        </Heading>
        <Badge text={PHASE_LABEL[phase]} tone={PHASE_TONE[phase]} />
      </View>
      <Caption>
        {formatDateTime(event.startDate)} → {formatDateTime(event.endDate)}
      </Caption>
      {!!event.description && (
        <Body muted numberOfLines={2}>
          {event.description}
        </Body>
      )}
      {!!progress && <ProgressBar found={progress.found} total={progress.total} />}
    </Card>
  );
}
