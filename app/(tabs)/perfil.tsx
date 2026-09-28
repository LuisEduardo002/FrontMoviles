import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { ScrollView, View } from 'react-native';
import Badge from '../../src/components/Badge';
import Button from '../../src/components/Button';
import Card from '../../src/components/Card';
import { Body, Caption, Heading } from '../../src/components/Typography';
import { API_URL } from '../../src/config/env';
import { decodeJwt } from '../../src/session/jwt';
import { useSession } from '../../src/session/context';
import { colors, glow } from '../../src/theme/tokens';
import { formatDateTime } from '../../src/utils/format';

/** La cuenta con la que se entró, a qué servidor apunta la app y la salida. */
export default function Perfil() {
  const { user, token, logout } = useSession();
  const payload = token ? decodeJwt(token) : null;

  return (
    <ScrollView className="flex-1 bg-canvas" contentContainerClassName="gap-4 p-3 pb-6">
      <View className="items-center gap-2 py-3">
        <View
          className="h-[88px] w-[88px] items-center justify-center rounded-full border-2 border-primary bg-surface"
          style={{ boxShadow: glow.primary }}>
          <MaterialDesignIcons name="account" size={48} color={colors.primary} />
        </View>
        <Heading level="h3" className="text-center">
          {user?.email}
        </Heading>
        <Badge text={user?.role === 'ADMIN' ? 'Administrador' : 'Jugador'} tone="secondary" />
      </View>

      <Card>
        <Heading level="h3">Sesión</Heading>
        <Body muted>
          {payload
            ? `Vence el ${formatDateTime(new Date(payload.exp * 1000).toISOString())}`
            : 'Sesión activa.'}
        </Body>
      </Card>

      <Card>
        <Heading level="h3">Servidor</Heading>
        <Body muted>{API_URL}</Body>
        <Caption>
          Si la app no conecta, revisa esta dirección en el archivo .env y recarga la app por
          completo.
        </Caption>
      </Card>

      <Button text="Cerrar sesión" icon="logout" variant="secondary" onPress={() => void logout()} />
    </ScrollView>
  );
}
