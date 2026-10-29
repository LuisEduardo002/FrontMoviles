import { StatusBar } from 'expo-status-bar';
import RootNavigator from '@/components/navigation/RootNavigator';
import AlertHost from '@/components/ui/AlertHost';
import { useAppFonts } from '@/hooks/useAppFonts';
import { SessionProvider } from '@/session/context';

/**
 * La raíz de la app: espera las fuentes (el splash sigue arriba), pone el
 * proveedor de sesión y monta la navegación y `AlertHost`, que pinta las
 * alertas de `showAlert`.
 */
export default function AppRoot() {
  const fontsReady = useAppFonts();
  if (!fontsReady) return null;

  return (
    <SessionProvider>
      <StatusBar style="light" />
      <RootNavigator />
      <AlertHost />
    </SessionProvider>
  );
}
