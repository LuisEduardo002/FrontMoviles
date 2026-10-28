import { router } from 'expo-router';
import { listEvents } from '@/api/events';
import EventCard from '@/components/events/EventCard';
import ListScreen from '@/components/ui/ListScreen';
import { EmptyState, LoadingScreen } from '@/components/ui/Screen';
import SearchBar from '@/components/ui/SearchBar';
import Segmented from '@/components/ui/Segmented';
import { useFocusLoad } from '@/hooks/useFocusLoad';
import { useListFilter } from '@/hooks/useListFilter';
import { EVENT_STATUS_FILTER } from '@/utils/listFilters';

/** Lista de eventos del admin con búsqueda por texto + filtro por estado. */
export default function EventList() {
  const { data: events, isLoading, isRefreshing, error, refresh } = useFocusLoad(listEvents, []);
  const { query, setQuery, filter, setFilter, filtered } = useListFilter(events, EVENT_STATUS_FILTER);

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
          <Segmented options={EVENT_STATUS_FILTER.options} value={filter} onChange={setFilter} />
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
