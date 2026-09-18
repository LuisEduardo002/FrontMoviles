import { Text, View } from 'react-native';
import Button from '../src/components/Button';
import { useSession } from '../src/session/context';

export default function Unauthorized() {
  const { logout } = useSession();

  return (
    <View className="flex-1 items-center justify-center gap-5 bg-base p-6">
      <View className="items-center gap-2">
        <Text className="text-2xl font-bold text-white">Acceso restringido</Text>
        <Text className="text-center text-neutral-400">
          Esta sección pertenece al panel de administración. Tu cuenta no tiene permisos de admin.
        </Text>
      </View>
      <Button text="Cerrar sesión" onPress={() => void logout()} />
    </View>
  );
}