import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useSession } from '@/session/context';
import { stackScreenOptions } from '@/theme/navigation';

// Tiene que correr antes del primer render: por eso va al cargar el módulo.
SplashScreen.preventAutoHideAsync();

/**
 * La navegación de la app. Con `Stack.Protected` decide qué pantallas
 * existen según haya sesión y el rol: sin sesión, las rutas privadas ni
 * siquiera están registradas, así que no hay forma de llegar a ellas.
 */
export default function RootNavigator() {
  const { user, isLoading } = useSession();

  // El splash se mantiene mientras se busca la sesión guardada: así no parpadea el login.
  useEffect(() => {
    if (!isLoading) SplashScreen.hide();
  }, [isLoading]);

  if (isLoading) return null;

  return (
    <Stack screenOptions={stackScreenOptions}>
      {/* Con sesión: los tabs (cambian según el rol) y lo que abren. */}
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* El admin lo edita; el jugador ve horario y tags. */}
        <Stack.Screen name="events/[id]" options={{ title: 'Evento' }} />
        <Stack.Screen name="chat/[room]" options={{ title: 'Chat' }} />
      </Stack.Protected>

      {/* Formularios del panel: exclusivos de ADMIN. */}
      <Stack.Protected guard={user?.role === 'ADMIN'}>
        <Stack.Screen name="events/new" options={{ title: 'Nuevo evento' }} />
        <Stack.Screen name="tags/new" options={{ title: 'Nuevo tag' }} />
        <Stack.Screen name="tags/[id]" options={{ title: 'Tag' }} />
        <Stack.Screen name="users/new" options={{ title: 'Nuevo usuario' }} />
        <Stack.Screen name="users/[id]" options={{ title: 'Usuario' }} />
      </Stack.Protected>

      {/* Sin sesión */}
      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ title: 'Crear cuenta' }} />
      </Stack.Protected>
    </Stack>
  );
}
