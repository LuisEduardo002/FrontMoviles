import { ScrollView, View } from 'react-native';
import AvatarEditor from '@/components/profile/AvatarEditor';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Body, Caption, Heading } from '@/components/ui/Typography';
import { useMyProfile } from '@/hooks/useMyProfile';
import { useSessionInfo } from '@/hooks/useSessionInfo';

/** Perfil del admin: su cuenta, la sesión, a qué servidor apunta la app y la salida. */
export default function AdminProfile() {
  const { profile, setAvatar } = useMyProfile();
  const session = useSessionInfo();

  return (
    <ScrollView className="flex-1 bg-canvas" contentContainerClassName="gap-4 p-3 pb-6">
      <View className="items-center gap-2 py-3">
        {profile && <AvatarEditor profile={profile} onChanged={setAvatar} />}
        <Heading level="h3" className="text-center">
          {profile?.nickname ?? session.email}
        </Heading>
        <Caption>{session.email}</Caption>
        <Badge text="Administrador" tone="secondary" />
      </View>

      <Card>
        <Heading level="h3">Sesión</Heading>
        <Body muted>
          {session.expiresAt
            ? `Se renueva sola cada vez que abres la app. Vence el ${session.expiresAt} si no la usas antes`
            : 'Sesión activa.'}
        </Body>
      </Card>

      <Card>
        <Heading level="h3">Servidor</Heading>
        <Body muted>{session.apiUrl}</Body>
        <Caption>
          Si la app no conecta, revisa esta dirección en el archivo .env y recarga la app por completo.
        </Caption>
      </Card>

      <Button text="Cerrar sesión" icon="logout" variant="secondary" onPress={session.logout} />
    </ScrollView>
  );
}
