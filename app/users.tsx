/**
 * Listado de usuarios registrados (GET /api/users).
 *
 * Es la pantalla que prueba de punta a punta que el token funciona: la ruta
 * está detrás de `authenticate`, así que si se ve la lista es que el
 * `Authorization: Bearer` viajó bien.
 */

import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { listUsers } from '../src/api/users';
import Button from '../src/components/Button';
import { useSession } from '../src/session/context';
import type { User } from '../src/types';

export default function Users() {
  const { user: currentUser } = useSession();
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // `useCallback` para poder reusar la misma función en el efecto y en el botón
  // de reintentar sin recrearla en cada render.
  const load = useCallback(async () => {
    setError(null);
    setUsers(null);
    try {
      setUsers(await listUsers());
    } catch (failure) {
      setError((failure as Error).message);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (error) {
    return (
      <View className="flex-1 justify-center gap-4 bg-neutral-50 p-6">
        <Text className="text-center text-red-700">{error}</Text>
        <Button text="Reintentar" onPress={() => void load()} secondary />
      </View>
    );
  }

  if (!users) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-neutral-50"
      contentContainerClassName="gap-3 p-6"
      data={users}
      keyExtractor={(item) => String(item.id)}
      ListEmptyComponent={
        <Text className="text-center text-neutral-500">No hay usuarios registrados.</Text>
      }
      renderItem={({ item }) => (
        <View className="gap-1 rounded-2xl bg-white p-4">
          <View className="flex-row items-center gap-2">
            <Text className="flex-1 font-semibold text-neutral-900">{item.name}</Text>
            {item.id === currentUser?.id && (
              <Text className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                tú
              </Text>
            )}
          </View>
          <Text className="text-neutral-500">{item.email}</Text>
          <Text className="mt-1 self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {item.role}
          </Text>
        </View>
      )}
    />
  );
}
