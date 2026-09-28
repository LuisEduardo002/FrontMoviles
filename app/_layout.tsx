/**
 * Layout raíz: envuelve TODA la app.
 *
 * Hace tres cosas:
 *  1. Carga las fuentes de dict_style.md y mantiene el splash mientras tanto,
 *     para que ninguna pantalla se pinte con la fuente del sistema y cambie.
 *  2. Pone el proveedor de sesión, para que cualquier pantalla pueda saber
 *     quién entró.
 *  3. Declara la navegación y decide, con `Stack.Protected`, qué pantallas
 *     existen según haya sesión o no. Sin sesión, las rutas privadas ni
 *     siquiera están registradas: no hay forma de llegar a ellas.
 */

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Orbitron_500Medium,
  Orbitron_700Bold,
  Orbitron_800ExtraBold,
} from '@expo-google-fonts/orbitron';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import '../global.css';
import { SessionProvider, useSession } from '../src/session/context';
import { stackScreenOptions } from '../src/theme/navigation';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Orbitron_500Medium,
    Orbitron_700Bold,
    Orbitron_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Si las fuentes fallan se sigue con las del sistema: mejor eso que un
  // splash eterno.
  if (!fontsLoaded && !fontError) return null;

  return (
    <SessionProvider>
      <StatusBar style="light" />
      <Navigator />
    </SessionProvider>
  );
}

function Navigator() {
  const { user, isLoading } = useSession();

  // Mientras se busca el token guardado no se sabe si hay sesión. El splash
  // sigue arriba para que no parpadee el login antes de saltar al panel.
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
