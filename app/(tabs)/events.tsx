import { useFocusEffect } from 'expo-router';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import Button from '../../src/components/Button';
import SearchBar from '../../src/components/SearchBar';
import { listEvents } from '../../src/api/events';
import { useSession } from '../../src/session/context';
import type { AdminEvent } from '../../src/types';
import { formatDate } from '../../src/utils/format';

type Filter = 'ALL' | 'ACTIVE' | 'INACTIVE';

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Activos', value: 'ACTIVE' },
  { label: 'Inactivos', value: 'INACTIVE' },
];

function EventCard({ event, onOpen, isAdmin }: { event: AdminEvent; onOpen: () => void; isAdmin: boolean }) {
  return (
    <View className="gap-3 rounded-2xl border border-secondary bg-tertiary p-5">
      <View className="gap-1">
        <View className="flex-row items-center justify-between">
          <Text className="flex-1 text-lg font-bold text-white">{event.name}</Text>
          <Text
            className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${
              event.isActive ? 'bg-primary' : 'bg-secondary'
            }`}>
            {event.isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
        <Text className="text-sm text-neutral-400" numberOfLines={2}>
          {event.description ?? 'Sin descripción'}
        </Text>
        <Text className="text-xs text-neutral-400">
          {formatDate(event.startDate)} → {formatDate(event.endDate)}
        </Text>
      </View>
      <Button text={isAdmin ? 'Ver / editar' : 'Ver detalle'} onPress={onOpen} secondary />
    </View>
  );
}

/** Lista de eventos con búsqueda por texto + filtro por estado. */
export default function Events() {
  const { user } = useSession();
  const isAdmin = user?.role === 'ADMIN';
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('ALL');
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      setEvents(await listEvents());
    } catch (failure) {
      setError((failure as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      if (filter === 'ACTIVE' && !e.isActive) return false;
      if (filter === 'INACTIVE' && e.isActive) return false;
      if (!q) return true;
      return [e.name, e.description ?? ''].some((field) => field.toLowerCase().includes(q));
    });
  }, [events, query, filter]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-base">
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-base">
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            isAdmin={isAdmin}
            onOpen={() => router.push({ pathname: '/events/[id]', params: { id: item.id } })}
          />
        )}
        contentContainerClassName="gap-4 p-6"
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => void load(true)} />
        }
        ListHeaderComponent={
          <View className="gap-4">
            <View className="gap-1">
              <Text className="text-2xl font-bold text-white">Eventos</Text>
              <Text className="text-sm text-neutral-400">
                {filtered.length} de {events.length} eventos
              </Text>
            </View>
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Buscar por nombre o descripción…"
            />
            <View className="flex-row gap-2">
              {FILTERS.map((option) => {
                const active = filter === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setFilter(option.value)}
                    className={`flex-1 items-center rounded-xl p-3 active:opacity-80 ${
                      active ? 'bg-primary' : 'border border-secondary'
                    }`}>
                    <Text
                      className={`font-semibold ${active ? 'text-white' : 'text-neutral-100'}`}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {isAdmin && <Button text="Nuevo evento" onPress={() => router.push('/events/new')} />}
            {!!error && (
              <Text className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-center text-red-200">
                {error}
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <View className="gap-3 rounded-2xl border border-secondary bg-tertiary p-5">
            <Text className="text-center text-xl font-bold text-white">Sin resultados</Text>
            <Text className="text-center text-neutral-400">
              Ningún evento coincide con la búsqueda o el filtro.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
