import { useFocusEffect } from 'expo-router';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';
import Button from '../../src/components/Button';
import SearchBar from '../../src/components/SearchBar';
import { listUsers } from '../../src/api/users';
import type { AdminUser } from '../../src/types';

function UserCard({ user, onOpen }: { user: AdminUser; onOpen: () => void }) {
  return (
    <View className="gap-3 rounded-2xl border border-secondary bg-tertiary p-5">
      <View className="gap-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-white">{user.nickname}</Text>
          <Text className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
            {user.role}
          </Text>
        </View>
        <Text className="text-sm text-neutral-400">{user.email}</Text>
        <Text className="text-xs text-neutral-400">
          {user.totalPoints} pts · {user.levelTitle}
        </Text>
      </View>
      <Button text="Ver / editar" onPress={onOpen} secondary />
    </View>
  );
}

/** Lista de usuarios con búsqueda por texto (apodo, correo o nivel). */
export default function Users() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      setUsers(await listUsers());
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
    if (!q) return users;
    return users.filter((u) =>
      [u.nickname, u.email, u.levelTitle ?? ''].some((field) => field.toLowerCase().includes(q)),
    );
  }, [users, query]);

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
          <UserCard user={item} onOpen={() => router.push({ pathname: '/users/[id]', params: { id: item.id } })} />
        )}
        contentContainerClassName="gap-4 p-6"
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => void load(true)} />
        }
        ListHeaderComponent={
          <View className="gap-4">
            <View className="gap-1">
              <Text className="text-2xl font-bold text-white">Usuarios</Text>
              <Text className="text-sm text-neutral-400">
                {filtered.length} de {users.length} usuarios
              </Text>
            </View>
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Buscar por apodo, correo o nivel…"
            />
            <Button text="Nuevo usuario" onPress={() => router.push('/users/new')} />
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
              {query ? 'Ningún usuario coincide con la búsqueda.' : 'Aún no hay usuarios.'}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
