import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { listEvents } from '../../api/events';
import { listPlayerTags } from '../../api/tags';
import Badge from '../../components/Badge';
import Card from '../../components/Card';
import ListScreen from '../../components/ListScreen';
import ProgressBar from '../../components/ProgressBar';
import { EmptyState, LoadingScreen } from '../../components/Screen';
import SearchBar from '../../components/SearchBar';
import Segmented from '../../components/Segmented';
import { Body, Caption, Heading } from '../../components/Typography';
import { useFocusLoad } from '../../hooks/useFocusLoad';
import type { AdminEvent, PlayerTag } from '../../types';
import { eventPhase, PHASE_LABEL, PHASE_TONE, type EventPhase } from '../../utils/events';
import { formatDateTime } from '../../utils/format';

const FILTERS = [
  { label: 'En curso', value: 'live' },
  { label: 'Próximos', value: 'upcoming' },
  { label: 'Finalizados', value: 'ended' },
] as const;

const EMPTY: Record<EventPhase, { title: string; message: string }> = {
  live: { title: 'Nada en curso', message: 'Revisa los próximos eventos para saber cuándo empieza la cacería.' },
  upcoming: { title: 'Sin eventos próximos', message: 'Cuando se anuncie uno nuevo aparecerá aquí.' },
  ended: { title: 'Aún no ha terminado ninguno', message: 'Los eventos pasados se guardan aquí.' },
};

/** Los tags solo dan el progreso: si fallan, los eventos se siguen mostrando. */
async function loadEvents() {
  const [events, tags] = await Promise.all([listEvents(), listPlayerTags().catch(() => [] as PlayerTag[])]);
  return { events, tags };
}

/**
 * Inicio del jugador: los eventos por momento (en curso, próximos,
 * finalizados), con su horario y cuántos tags lleva de cada uno.
 */
export default function PlayerEvents() {
  const { data, isLoading, isRefreshing, error, refresh } = useFocusLoad(loadEvents, {
    events: [] as AdminEvent[],
    tags: [] as PlayerTag[],
  });
  const [phase, setPhase] = useState<EventPhase>('live');
  const [query, setQuery] = useState('');

  const progress = useMemo(() => {
    const byEvent = new Map<string, { found: number; total: number }>();
    for (const tag of data.tags) {
      if (!tag.eventId) continue;
      const entry = byEvent.get(tag.eventId) ?? { found: 0, total: 0 };
      entry.total += 1;
      if (tag.foundByMe) entry.found += 1;
      byEvent.set(tag.eventId, entry);
    }
    return byEvent;
  }, [data.tags]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.events
      .filter((event) => eventPhase(event) === phase)
      .filter((event) => !q || [event.name, event.description ?? ''].some((f) => f.toLowerCase().includes(q)))
      .sort((a, b) =>
        // Los próximos, del más cercano; el resto, del más reciente
        phase === 'upcoming'
          ? a.startDate.localeCompare(b.startDate)
          : b.startDate.localeCompare(a.startDate),
      );
  }, [data.events, phase, query]);

  if (isLoading) return <LoadingScreen />;

  return (
    <ListScreen
      items={filtered}
      total={data.events.filter((event) => eventPhase(event) === phase).length}
      noun={['evento', 'eventos']}
      error={error}
      isRefreshing={isRefreshing}
      onRefresh={refresh}
      controls={
        <>
          <Segmented options={FILTERS} value={phase} onChange={setPhase} />
          <SearchBar value={query} onChange={setQuery} placeholder="Buscar evento" />
        </>
      }
      renderItem={(event) => (
        <PlayerEventCard
          event={event}
          progress={progress.get(event.id)}
          onOpen={() => router.push({ pathname: '/events/[id]', params: { id: event.id } })}
        />
      )}
      empty={<EmptyState icon="calendar-search" {...EMPTY[phase]} />}
    />
  );
}

function PlayerEventCard({
  event,
  progress,
  onOpen,
}: {
  event: AdminEvent;
  progress?: { found: number; total: number };
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
