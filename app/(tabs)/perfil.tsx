import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, Text, View } from 'react-native';
import { useSession } from '../../src/session/context';

/** Perfil en dark mode NFHunter. */
export default function Perfil() {
  const { user, logout } = useSession();

  return (
    <View className="flex-1 gap-6 bg-base p-6">
      <View className="items-center gap-3 rounded-2xl border border-secondary bg-tertiary p-6">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <MaterialCommunityIcons name="account" size={44} color="#fff" />
        </View>
        <Text className="text-xl font-bold text-white">{user?.email ?? 'Cazador'}</Text>
        <Text className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
          {user?.role ?? 'USER'}
        </Text>
      </View>

      <Pressable
        onPress={() => void logout()}
        className="items-center rounded-2xl border border-secondary p-4 active:opacity-80">
        <Text className="font-semibold text-neutral-200">Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}
