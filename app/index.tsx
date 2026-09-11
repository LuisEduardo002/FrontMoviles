import { Text, View } from 'react-native';
import Button from '../src/components/Button';
import { useSession } from '../src/session/context';

/** Pantalla de inicio: quién eres y qué puedes hacer. */
export default function Home() {
  const { user, logout } = useSession();

  return (
    <View className="flex-1 gap-6 bg-neutral-50 p-6">
      <View className="gap-1 rounded-2xl bg-white p-5">
        {/*
          Se muestra el correo porque es lo único que identifica al usuario en la
          respuesta de /auth: el `nickname` está en la tabla `users` pero ningún
          endpoint lo devuelve todavía.
        */}
        <Text className="text-xl font-bold text-neutral-900">Hola</Text>
        <Text className="text-neutral-500">{user?.email}</Text>
        {/* El rol lo asigna el backend (USER por defecto, ADMIN a mano). */}
        <Text className="mt-2 self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {user?.role}
        </Text>
      </View>

      <View className="gap-3">
        <Button text="Cerrar sesión" onPress={() => void logout()} secondary />
      </View>
    </View>
  );
}
