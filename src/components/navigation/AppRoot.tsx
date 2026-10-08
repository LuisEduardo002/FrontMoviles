import { StatusBar } from 'expo-status-bar';
import RootNavigator from '@/components/navigation/RootNavigator';
import { useAppFonts } from '@/hooks/useAppFonts';
import { SessionProvider } from '@/session/context';

/**
 * La raíz de la app: espera las fuentes (el splash sigue arriba), pone el
 * proveedor de sesión y monta la navegación.
 */
export default function AppRoot() {
  const fontsReady = useAppFonts();
  if (!fontsReady) return null;

  return (
    <SessionProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </SessionProvider>
  );
}
