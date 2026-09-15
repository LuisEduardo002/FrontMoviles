import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Text, View } from 'react-native';
import Button from '../../src/components/Button';
import { useSession } from '../../src/session/context';
import { USE_MOCK } from '../../src/config/env';

/** Perfil del administrador con estado de la fuente de datos y salida. */
export default function Perfil() {
  const { user, logout } = useSession();

  return (
    <View className="flex-1 gap-6 bg-base p-6">
      <View className="items-center gap-3 rounded-2xl border border-secondary bg-tertiary p-6">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <MaterialCommunityIcons name="account" size={44} color="#fff" />
        </View>
        <Text className="text-xl font-bold text-white">{user?.email ?? 'Admin'}</Text>
        <Text className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
          {user?.role ?? 'ADMIN'} · Panel admin
        </Text>
      </View>

      <View className="gap-3 rounded-2xl border border-secondary bg-tertiary p-5">
        <Text className="text-xl font-bold text-white">Fuente de datos</Text>
        <Text className="text-neutral-200">
          {USE_MOCK
            ? 'Modo local: los CRUD usan datos en memoria (listos para conectar el backend).'
            : 'Modo backend: los CRUD llaman a la API configurada en .env.'}
        </Text>
        <Text className="text-xs text-neutral-400">
          Para conectar el backend: EXPO_PUBLIC_USE_MOCK=false y recarga completa.
        </Text>
      </View>

      <Button text="Cerrar sesión" onPress={() => void logout()} secondary />
    </View>
  );
}
