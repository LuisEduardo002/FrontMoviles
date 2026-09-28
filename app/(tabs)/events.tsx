import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { listEvents } from '../../src/api/events';
import Badge from '../../src/components/Badge';
import Card from '../../src/components/Card';
import ListScreen from '../../src/components/ListScreen';
import { EmptyState, LoadingScreen } from '../../src/components/Screen';
import SearchBar from '../../src/components/SearchBar';
import Segmented from '../../src/components/Segmented';
import { Body, Caption, Heading } from '../../src/components/Typography';
import { useFocusLoad } from '../../src/hooks/useFocusLoad';
import type { AdminEvent } from '../../src/types';
import { formatDate } from '../../src/utils/format';

type Filter = 'ALL' | 'ACTIVE' | 'INACTIVE';

const FILTERS = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Activos', value: 'ACTIVE' },
  { label: 'Inactivos', value: 'INACTIVE' },
] as const;

/** Lista de eventos con búsqueda por texto + filtro por estado. */
export default function Events() {
  const { data: events, isLoading, isRefreshing, error, refresh } = useFocusLoad(listEvents, []);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('ALL');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      if (filter === 'ACTIVE' && !e.isActive) return false;
      if (filter === 'INACTIVE' && e.isActive) return false;
      if (!q) return true;
      return [e.name, e.description ?? ''].some((field) => field.toLowerCase().includes(q));
    });
  }, [events, query, filter]);

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
          <Segmented options={FILTERS} value={filter} onChange={setFilter} />
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
          <EmptyState
            icon="calendar-blank"
            title="Aún no hay eventos"
            message="Crea el primero con el botón Nuevo."
          />
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

function EventCard({ event, onOpen }: { event: AdminEvent; onOpen: () => void }) {
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
