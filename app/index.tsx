import { Text, View } from 'react-native';
import Button from '../src/layout/Button';
import { useAuth } from '../auth';

export default function Home() {
  const { user, signOut } = useAuth();

  return (
    <View className="flex-1 items-center justify-center gap-4">
      <Text className="text-2xl font-semibold">Hola, {user?.name}</Text>
      <Text>{user?.email}</Text>
      <Button text="Cerrar sesión" onPress={signOut} />
    </View>
  );
}
