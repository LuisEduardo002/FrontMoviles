import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { View } from 'react-native';
import Button from '../src/components/Button';
import { Body, Heading } from '../src/components/Typography';
import { useSession } from '../src/session/context';
import { colors } from '../src/theme/tokens';

/**
 * Lo que ve una cuenta de jugador: por ahora la app solo trae el panel de
 * administración y el backend todavía no expone lo que necesita un jugador
 * (tags visibles para USER, escaneos).
 */
export default function Unauthorized() {
  const { user, logout } = useSession();

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-canvas p-4">
      <MaterialDesignIcons name="shield-lock-outline" size={64} color={colors.secondary} />
      <View className="max-w-[480px] items-center gap-2">
        <Heading level="h2" className="text-center">
          Solo para administradores
        </Heading>
        <Body muted className="text-center">
          {user?.email} es una cuenta de jugador. Por ahora la app solo trae el panel de
          administración; la experiencia de juego llegará en una próxima versión.
        </Body>
      </View>
      <Button text="Cerrar sesión" icon="logout" variant="secondary" onPress={() => void logout()} />
    </View>
  );
}
