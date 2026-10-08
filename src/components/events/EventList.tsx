import { router } from 'expo-router';
import EventCard from '@/components/events/EventCard';
import ListScreen from '@/components/ui/ListScreen';
import { EmptyState, LoadingScreen } from '@/components/ui/Screen';
import SearchBar from '@/components/ui/SearchBar';
import Segmented from '@/components/ui/Segmented';
import { EVENT_STATUS_FILTERS, useEventFilters } from '@/hooks/useEventFilters';
import { useEvents } from '@/hooks/useEvents';

/** Lista de eventos del admin con búsqueda por texto + filtro por estado. */
export default function EventList() {
  const { events, isLoading, isRefreshing, error, refresh } = useEvents();
  const { query, setQuery, status, setStatus, filtered } = useEventFilters(events);

  if (isLoading) return <LoadingScreen />;

  return (
    <ListScreen
      items={filtered}
      total={events.length}
      noun={['evento', 'eventos']}
      error={error}
      isRefreshing={isRefreshing}
      onRefresh={refresh}
      controls={
        <>
          <SearchBar value={query} onChange={setQuery} placeholder="Buscar por nombre o descripción" />
          <Segmented options={EVENT_STATUS_FILTERS} value={status} onChange={setStatus} />
        </>
      }
      renderItem={(event) => (
        <EventCard
          event={event}
          onOpen={() => router.push({ pathname: '/events/[id]', params: { id: event.id } })}
        />
      )}
      empty={
        events.length === 0 ? (
          <EmptyState icon="calendar-blank" title="Aún no hay eventos" message="Crea el primero con el botón Nuevo." />
        ) : (
          <EmptyState
            icon="magnify-close"
            title="Sin resultados"
            message="Ningún evento coincide con la búsqueda o el filtro."
          />
        )
      }
    />
  );
}
