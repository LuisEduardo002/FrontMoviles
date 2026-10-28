import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { router, Stack } from 'expo-router';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import PlayerTagCard from '@/components/tags/PlayerTagCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { EmptyState, ErrorScreen, LoadingScreen } from '@/components/ui/Screen';
import { Body, Caption, Heading } from '@/components/ui/Typography';
import { usePlayerEvent } from '@/hooks/usePlayerEvent';
import { PlayerEventDetailToken, ScrollScreenToken } from '@/theme/Token';
import { colors } from '@/theme/tokens';
import { PHASE_LABEL, PHASE_TONE } from '@/utils/events';
import { formatDateTime } from '@/utils/format';

/**
 * Un evento visto por el jugador: cuándo es, cuánto lleva y qué tags le
 * faltan. La carga vive en `usePlayerEvent`.
 */
export default function PlayerEventDetail({ id }: { id: string }) {
  const { event, tags, phase, found, isLoading, isRefreshing, error, refresh } = usePlayerEvent(id);

  if (isLoading) return <LoadingScreen />;
  if (!event || !phase) return <ErrorScreen message={error ?? 'Evento no encontrado.'} />;

  return (
    <ScrollView
      className={ScrollScreenToken.container}
      contentContainerClassName={ScrollScreenToken.content}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={colors.primary} />
      }>
      <Stack.Screen options={{ title: event.name }} />

      <Card>
        <Badge text={PHASE_LABEL[phase]} tone={PHASE_TONE[phase]} />
        <Schedule label="Empieza" date={event.startDate} />
        <Schedule label="Termina" date={event.endDate} />
        {!!event.description && <Body muted>{event.description}</Body>}
        {tags.length > 0 && <ProgressBar found={found} total={tags.length} />}
      </Card>

      {phase !== 'ended' && (
        <View className={PlayerEventDetailToken.actions}>
          {phase === 'live' && (
            <Button text="Escanear un tag" icon="qrcode-scan" onPress={() => router.navigate('/(tabs)/scan')} />
          )}
          <Button
            text="Chat del evento"
            icon="forum"
            variant="secondary"
            onPress={() =>
              router.push({ pathname: '/chat/[room]', params: { room: `event:${event.id}`, name: event.name } })
            }
          />
        </View>
      )}

      <Heading level="h3">Tags del evento</Heading>
      {tags.length === 0 ? (
        <EmptyState icon="nfc-variant-off" title="Sin tags todavía" message="Este evento aún no tiene tags publicados." />
      ) : (
        tags.map((tag) => <PlayerTagCard key={tag.id} tag={tag} canHunt={phase === 'live'} />)
      )}
    </ScrollView>
  );
}

function Schedule({ label, date }: { label: string; date: string }) {
  return (
    <View className={PlayerEventDetailToken.dateRow}>
      <MaterialDesignIcons name="clock-outline" size={PlayerEventDetailToken.iconSize} color={colors.secondary} />
      <Text className={PlayerEventDetailToken.dateLabel}>{label}</Text>
      <Caption>{formatDateTime(date)}</Caption>
    </View>
  );
}
