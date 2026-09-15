/**
 * Layout raíz: envuelve TODA la app.
 *
 * Hace dos cosas:
 *  1. Pone el proveedor de sesión, para que cualquier pantalla pueda saber
 *     quién entró.
 *  2. Declara la navegación y decide, con `Stack.Protected`, qué pantallas
 *     existen según haya sesión o no. Sin sesión, las rutas privadas ni
 *     siquiera están registradas: no hay forma de llegar a ellas.
 */

import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import '../global.css';
import { SessionProvider, useSession } from '../src/session/context';

export default function RootLayout() {
  return (
    <SessionProvider>
      <Navigator />
    </SessionProvider>
  );
}

function Navigator() {
  const { user, isLoading } = useSession();

  // Mientras se busca el token guardado no se sabe todavía si hay sesión. Sin
  // esta espera, la app mostraría el login un instante y luego saltaría al
  // inicio: un parpadeo feo cada vez que se abre.
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-base">
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1c0a1c' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
      }}>
      {/* Con sesión iniciada: panel admin + formularios de cada entidad */}
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="users/new" options={{ title: 'Nuevo usuario' }} />
        <Stack.Screen name="users/[id]" options={{ title: 'Detalle de usuario' }} />
        <Stack.Screen name="events/new" options={{ title: 'Nuevo evento' }} />
        <Stack.Screen name="events/[id]" options={{ title: 'Detalle de evento' }} />
        <Stack.Screen name="scans/new" options={{ title: 'Nuevo escaneo' }} />
        <Stack.Screen name="scans/[id]" options={{ title: 'Detalle de escaneo' }} />
      </Stack.Protected>

      {/* Sin sesión */}
      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" options={{ title: 'Iniciar sesión' }} />
        <Stack.Screen name="register" options={{ title: 'Crear cuenta' }} />
      </Stack.Protected>
    </Stack>
  );
}
