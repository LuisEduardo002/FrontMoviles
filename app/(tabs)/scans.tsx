import { useFocusEffect } from 'expo-router';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Button from '../../src/components/Button';
import SearchBar from '../../src/components/SearchBar';
import { listScans } from '../../src/api/scans';
import { listUsers } from '../../src/api/users';
import type { AdminUser, ScanHistory } from '../../src/types';
import { formatDateTime } from '../../src/utils/format';

function ScanCard({ scan, onOpen }: { scan: ScanHistory; onOpen: () => void }) {
  return (
    <View className="gap-3 rounded-2xl border border-secondary bg-tertiary p-5">
      <View className="gap-1">
        <View className="flex-row items-center justify-between">
          <Text className="flex-1 text-lg font-bold text-white">{scan.tagCode}</Text>
          <Text className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
            +{scan.pointsEarned} pts
          </Text>
        </View>
        <Text className="text-neutral-200">
          {scan.user?.nickname ?? 'Usuario'} · {scan.user?.email ?? scan.userId}
        </Text>
        <Text className="text-sm text-neutral-400">{scan.location}</Text>
        <Text className="text-xs text-neutral-400">{formatDateTime(scan.scannedAt)}</Text>
      </View>
      <Button text="Ver / editar" onPress={onOpen} secondary />
    </View>
  );
}

/**
 * Historial de escaneos: bitácora User <-> NfcTag.
 * Búsqueda por texto (tag, ubicación, usuario) + filtro por usuario.
 */
export default function Scans() {
  const [scans, setScans] = useState<ScanHistory[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState('');
  const [userFilter, setUserFilter] = useState<string>('ALL');
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const [scanList, userList] = await Promise.all([listScans(), listUsers()]);
      setScans(scanList);
      setUsers(userList);
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
    return scans.filter((s) => {
      if (userFilter !== 'ALL' && s.userId !== userFilter) return false;
      if (!q) return true;
      return [s.tagCode, s.location, s.user?.nickname ?? '', s.user?.email ?? '']
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [scans, query, userFilter]);

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
          <ScanCard scan={item} onOpen={() => router.push({ pathname: '/scans/[id]', params: { id: item.id } })} />
        )}
        contentContainerClassName="gap-4 p-6"
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => void load(true)} />
        }
        ListHeaderComponent={
          <View className="gap-4">
            <View className="gap-1">
              <Text className="text-2xl font-bold text-white">Historial de escaneos</Text>
              <Text className="text-sm text-neutral-400">
                {filtered.length} de {scans.length} escaneos
              </Text>
            </View>
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Buscar por tag, ubicación o usuario…"
            />
            <View className="gap-1.5">
              <Text className="font-semibold text-neutral-200">Filtrar por usuario</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => setUserFilter('ALL')}
                    className={`rounded-xl p-3 active:opacity-80 ${
                      userFilter === 'ALL' ? 'bg-primary' : 'border border-secondary'
                    }`}>
                    <Text
                      className={`font-semibold ${userFilter === 'ALL' ? 'text-white' : 'text-neutral-100'}`}>
                      Todos
                    </Text>
                  </Pressable>
                  {users.map((user) => {
                    const active = userFilter === user.id;
                    return (
                      <Pressable
                        key={user.id}
                        onPress={() => setUserFilter(active ? 'ALL' : user.id)}
                        className={`rounded-xl p-3 active:opacity-80 ${
                          active ? 'bg-primary' : 'border border-secondary'
                        }`}>
                        <Text
                          className={`font-semibold ${active ? 'text-white' : 'text-neutral-100'}`}>
                          {user.nickname}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
            <Button text="Nuevo escaneo" onPress={() => router.push('/scans/new')} />
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
              Ningún escaneo coincide con la búsqueda o el filtro.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
