import { ScrollView, View } from 'react-native';
import AvatarEditor from '@/components/profile/AvatarEditor';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Body, Caption, Heading } from '@/components/ui/Typography';
import { useMyProfile } from '@/hooks/useMyProfile';
import { API_URL } from '@/config/env';
import { useSession } from '@/session/context';
import { decodeJwt } from '@/session/jwt';
import { AdminProfileToken, ScrollScreenToken } from '@/theme/Token';
import { formatDateTime } from '@/utils/format';

/** Perfil del admin: su cuenta, la sesión, a qué servidor apunta la app y la salida. */
export default function AdminProfile() {
  const { profile, setAvatar } = useMyProfile();
  const { user, token, logout } = useSession();
  const payload = token ? decodeJwt(token) : null;
  const expiresAt = payload ? formatDateTime(new Date(payload.exp * 1000).toISOString()) : null;

  return (
    <ScrollView className={ScrollScreenToken.container} contentContainerClassName={ScrollScreenToken.content}>
      <View className={AdminProfileToken.header}>
        {profile && <AvatarEditor profile={profile} onChanged={setAvatar} />}
        <Heading level="h3" className={AdminProfileToken.name}>
          {profile?.nickname ?? user?.email}
        </Heading>
        <Caption>{user?.email}</Caption>
        <Badge text="Administrador" tone="secondary" />
      </View>

      <Card>
        <Heading level="h3">Sesión</Heading>
        <Body muted>
          {expiresAt
            ? `Se renueva sola cada vez que abres la app. Vence el ${expiresAt} si no la usas antes`
            : 'Sesión activa.'}
        </Body>
      </Card>

      <Card>
        <Heading level="h3">Servidor</Heading>
        <Body muted>{API_URL}</Body>
        <Caption>
          Si la app no conecta, revisa esta dirección en el archivo .env y recarga la app por completo.
        </Caption>
      </Card>

      <Button text="Cerrar sesión" icon="logout" variant="secondary" onPress={() => void logout()} />
    </ScrollView>
  );
}
