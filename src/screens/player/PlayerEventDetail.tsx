import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { router, Stack } from 'expo-router';
import { useCallback } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { getEvent } from '../../api/events';
import { listPlayerTags } from '../../api/tags';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import { EmptyState, ErrorScreen, LoadingScreen } from '../../components/Screen';
import { Body, Caption, Heading } from '../../components/Typography';
import { useFocusLoad } from '../../hooks/useFocusLoad';
import { CardTitleRowToken, PlayerEventDetailToken, ScrollScreenToken } from '../../theme/Token';
import { colors } from '../../theme/tokens';
import type { AdminEvent, PlayerTag } from '../../types';
import { eventPhase, PHASE_LABEL, PHASE_TONE } from '../../utils/events';
import { formatDateTime } from '../../utils/format';
import { openInMaps } from '../../utils/maps';

/**
 * Un evento visto por el jugador: cuándo es, cuánto lleva y qué tags le
 * faltan. Los visibles traen "Cómo llegar"; los ocultos, solo su pista.
 */
export default function PlayerEventDetail({ id }: { id: string }) {
  const load = useCallback(async () => {
    const [event, tags] = await Promise.all([getEvent(id), listPlayerTags(id)]);
    // Primero lo que falta por encontrar
    tags.sort((a, b) => Number(a.foundByMe) - Number(b.foundByMe));
    return { event, tags };
  }, [id]);
  const { data, isLoading, isRefreshing, error, refresh } = useFocusLoad<{
    event: AdminEvent | null;
    tags: PlayerTag[];
  }>(load, { event: null, tags: [] });

  if (isLoading) return <LoadingScreen />;
  if (!data.event) return <ErrorScreen message={error ?? 'Evento no encontrado.'} />;

  const { event, tags } = data;
  const phase = eventPhase(event);
  const found = tags.filter((tag) => tag.foundByMe).length;

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

function PlayerTagCard({ tag, canHunt }: { tag: PlayerTag; canHunt: boolean }) {
  const hasLocation = tag.latitude != null && tag.longitude != null;

  return (
    <Card>
      <View className={CardTitleRowToken.container}>
        <Heading level="h3" className={CardTitleRowToken.title} numberOfLines={2}>
          {tag.name}
        </Heading>
        <Badge text={`+${tag.pointsReward} pts`} tone={tag.foundByMe ? 'muted' : 'primary'} />
      </View>
      <View className={PlayerEventDetailToken.badges}>
        {tag.foundByMe && <Badge text="Encontrado" tone="primary" />}
        {tag.isHidden && <Badge text="Oculto" tone="secondary" />}
      </View>
      {!!tag.description && <Body muted>{tag.description}</Body>}
      {!!tag.clueText && (
        <View className={PlayerEventDetailToken.clue}>
          <MaterialDesignIcons name="lightbulb-on-outline" size={PlayerEventDetailToken.iconSize} color={colors.secondary} />
          <Text className={PlayerEventDetailToken.clueText}>{tag.clueText}</Text>
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
