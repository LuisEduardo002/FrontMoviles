import { Stack } from 'expo-router';
import '../global.css';
import { AuthProvider, useAuth } from '../auth';

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const { user } = useAuth();

  return (
    <Stack>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="index" options={{ title: 'Inicio' }} />
      </Stack.Protected>

      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" options={{ title: 'Iniciar sesión' }} />
        <Stack.Screen name="register" options={{ title: 'Crear cuenta' }} />
      </Stack.Protected>
    </Stack>
  );
}
