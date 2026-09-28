import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { Text, View } from 'react-native';
import Button from '../../src/components/Button';
import { useSession } from '../../src/session/context';
import { API_URL } from '../../src/config/env';

/** Perfil del administrador con estado de la fuente de datos y salida. */
export default function Perfil() {
  const { user, logout } = useSession();

  return (
    <View className="flex-1 gap-6 bg-base p-6">
      <View className="items-center gap-3 rounded-2xl border border-secondary bg-tertiary p-6">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <MaterialDesignIcons name="account" size={44} color="#fff" />
        </View>
        <Text className="text-xl font-bold text-white">{user?.email ?? 'Admin'}</Text>
        <Text className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
          {user?.role ?? 'ADMIN'} · Panel admin
        </Text>
      </View>

      <View className="gap-3 rounded-2xl border border-secondary bg-tertiary p-5">
        <Text className="text-xl font-bold text-white">Servidor</Text>
        <Text className="text-neutral-200">{API_URL}</Text>
      </View>

      <Button text="Cerrar sesión" onPress={() => void logout()} secondary />
    </View>
  );
}
