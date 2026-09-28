import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { listEvents } from '../../src/api/events';
import { listTags } from '../../src/api/tags';
import Badge from '../../src/components/Badge';
import Card from '../../src/components/Card';
import ListScreen from '../../src/components/ListScreen';
import { EmptyState, LoadingScreen } from '../../src/components/Screen';
import SearchBar from '../../src/components/SearchBar';
import Segmented from '../../src/components/Segmented';
import { Caption, Heading } from '../../src/components/Typography';
import { useFocusLoad } from '../../src/hooks/useFocusLoad';
import type { AdminEvent, NfcTag } from '../../src/types';

type Filter = 'ALL' | 'VISIBLE' | 'HIDDEN';

const FILTERS = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Visibles', value: 'VISIBLE' },
  { label: 'Ocultos', value: 'HIDDEN' },
] as const;

/** Los eventos solo ponen nombre al tag: si fallan, la lista de tags sigue. */
async function loadTags() {
  const [tags, events] = await Promise.all([listTags(), listEvents().catch(() => [] as AdminEvent[])]);
  return { tags, events };
}

/** Lista de tags NFC con búsqueda por texto + filtro por visibilidad. */
export default function Tags() {
  const { data, isLoading, isRefreshing, error, refresh } = useFocusLoad(loadTags, {
    tags: [] as NfcTag[],
    events: [] as AdminEvent[],
  });
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('ALL');

  const eventNames = useMemo(
    () => new Map(data.events.map((event) => [event.id, event.name])),
    [data.events],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.tags.filter((t) => {
      if (filter === 'VISIBLE' && t.isHidden) return false;
      if (filter === 'HIDDEN' && !t.isHidden) return false;
      if (!q) return true;
      return [t.code, t.name, t.description ?? '', t.clueText ?? ''].some((field) =>
        field.toLowerCase().includes(q),
      );
    });
  }, [data.tags, query, filter]);

  if (isLoading) return <LoadingScreen />;

  return (
    <ListScreen
      items={filtered}
      total={data.tags.length}
      noun="tags"
      error={error}
      isRefreshing={isRefreshing}
      onRefresh={refresh}
      controls={
        <>
          <SearchBar value={query} onChange={setQuery} placeholder="Buscar por código, nombre o pista" />
          <Segmented options={FILTERS} value={filter} onChange={setFilter} />
        </>
      }
      renderItem={(tag) => (
        <TagCard
          tag={tag}
          eventName={tag.eventId ? eventNames.get(tag.eventId) : undefined}
          onOpen={() => router.push({ pathname: '/tags/[id]', params: { id: tag.id } })}
        />
      )}
      empty={
        data.tags.length === 0 ? (
          <EmptyState
            icon="nfc-variant-off"
            title="Aún no hay tags"
            message="Crea el primero con el botón Nuevo."
          />
        ) : (
          <EmptyState
            icon="magnify-close"
            title="Sin resultados"
            message="Ningún tag coincide con la búsqueda o el filtro."
          />
        )
      }
    />
  );
}

function TagCard({ tag, eventName, onOpen }: { tag: NfcTag; eventName?: string; onOpen: () => void }) {
  return (
    <Card onPress={onOpen}>
      <Text className="font-data text-overline uppercase text-secondary">{tag.code}</Text>
      <Heading level="h3" numberOfLines={2}>
        {tag.name}
      </Heading>
      <View className="flex-row flex-wrap gap-2">
        <Badge text={`+${tag.pointsReward} pts`} tone="primary" />
        {tag.isHidden && <Badge text="Oculto" />}
        {!!eventName && <Badge text={eventName} tone="secondary" />}
      </View>
      <Caption>
        {tag.latitude.toFixed(5)}, {tag.longitude.toFixed(5)}
      </Caption>
    </Card>
  );
}
