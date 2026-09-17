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
import { listTags } from '../../src/api/tags';
import type { NfcTag } from '../../src/types';

type Filter = 'ALL' | 'VISIBLE' | 'HIDDEN';

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Visibles', value: 'VISIBLE' },
  { label: 'Ocultos', value: 'HIDDEN' },
];

function TagCard({ tag, onOpen }: { tag: NfcTag; onOpen: () => void }) {
  return (
    <View className="gap-3 rounded-2xl border border-secondary bg-tertiary p-5">
      <View className="gap-1">
        <View className="flex-row items-center justify-between">
          <Text className="flex-1 text-lg font-bold text-white">{tag.code}</Text>
          <Text className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
            +{tag.pointsReward} pts
          </Text>
        </View>
        <Text className="text-neutral-200">{tag.name}</Text>
        <Text className="text-sm text-neutral-400" numberOfLines={2}>
          {tag.description ?? 'Sin descripción'}
        </Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-xs text-neutral-400">{tag.location}</Text>
          {tag.isHidden && (
            <Text className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-neutral-200">
              Oculto
            </Text>
          )}
        </View>
      </View>
      <Button text="Ver / editar" onPress={onOpen} secondary />
    </View>
  );
}

/** Lista de tags NFC con búsqueda por texto + filtro por visibilidad. */
export default function Tags() {
  const [tags, setTags] = useState<NfcTag[]>([]);
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
      setTags(await listTags());
    } catch (failure) {
      setError((failure as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Recarga cada vez que la tab recupera el foco (al volver de crear/editar).
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tags.filter((t) => {
      if (filter === 'VISIBLE' && t.isHidden) return false;
      if (filter === 'HIDDEN' && !t.isHidden) return false;
      if (!q) return true;
      return [t.code, t.name, t.location, t.description ?? ''].some((field) =>
        field.toLowerCase().includes(q),
      );
    });
  }, [tags, query, filter]);

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
          <TagCard tag={item} onOpen={() => router.push({ pathname: '/tags/[id]', params: { id: item.id } })} />
        )}
        contentContainerClassName="gap-4 p-6"
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => void load(true)} />
        }
        ListHeaderComponent={
          <View className="gap-4">
            <View className="gap-1">
              <Text className="text-2xl font-bold text-white">Tags NFC</Text>
              <Text className="text-sm text-neutral-400">
                {filtered.length} de {tags.length} tags
              </Text>
            </View>
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Buscar por código, nombre o ubicación…"
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
            <Button text="Nuevo tag" onPress={() => router.push('/tags/new')} />
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
              Ningún tag coincide con la búsqueda o el filtro.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
