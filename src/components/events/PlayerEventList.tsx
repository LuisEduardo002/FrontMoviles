import { router } from 'expo-router';
import PlayerEventCard from '@/components/events/PlayerEventCard';
import ListScreen from '@/components/ui/ListScreen';
import { EmptyState, LoadingScreen } from '@/components/ui/Screen';
import SearchBar from '@/components/ui/SearchBar';
import Segmented from '@/components/ui/Segmented';
import { EVENT_PHASE_FILTERS, useEventPhaseFilter } from '@/hooks/useEventPhaseFilter';
import { usePlayerEvents } from '@/hooks/usePlayerEvents';
import type { EventPhase } from '@/utils/events';

const EMPTY: Record<EventPhase, { title: string; message: string }> = {
  live: { title: 'Nada en curso', message: 'Revisa los próximos eventos para saber cuándo empieza la cacería.' },
  upcoming: { title: 'Sin eventos próximos', message: 'Cuando se anuncie uno nuevo aparecerá aquí.' },
  ended: { title: 'Aún no ha terminado ninguno', message: 'Los eventos pasados se guardan aquí.' },
};

/**
 * Inicio del jugador: los eventos por momento (en curso, próximos,
 * finalizados), con su horario y cuántos tags lleva de cada uno.
 */
export default function PlayerEventList() {
  const { events, progress, isLoading, isRefreshing, error, refresh } = usePlayerEvents();
  const { phase, setPhase, query, setQuery, filtered, totalInPhase } = useEventPhaseFilter(events);

  if (isLoading) return <LoadingScreen />;

  return (
    <ListScreen
      items={filtered}
      total={totalInPhase}
      noun={['evento', 'eventos']}
      error={error}
      isRefreshing={isRefreshing}
      onRefresh={refresh}
      controls={
        <>
          <Segmented options={EVENT_PHASE_FILTERS} value={phase} onChange={setPhase} />
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
