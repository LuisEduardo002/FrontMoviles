import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { getMyProfile } from '@/api/profile';
import AvatarEditor from '@/components/profile/AvatarEditor';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Body, Caption, Heading } from '@/components/ui/Typography';
import { API_URL } from '@/config/env';
import { useFocusLoad } from '@/hooks/useFocusLoad';
import PlayerProfile from '@/components/profile/PlayerProfile';
import { decodeJwt } from '@/session/jwt';
import { useSession } from '@/session/context';
import type { MyProfile } from '@/types';
import { formatDateTime } from '@/utils/format';

/** El jugador ve su álbum; el admin, los datos de su sesión. */
export default function Perfil() {
  const { user } = useSession();
  return user?.role === 'ADMIN' ? <AdminProfile /> : <PlayerProfile />;
}

/** La cuenta con la que se entró, a qué servidor apunta la app y la salida. */
function AdminProfile() {
  const { user, token, logout } = useSession();
  const { data } = useFocusLoad<MyProfile | null>(getMyProfile, null);
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const profile = data && { ...data, avatarUrl: newAvatar ?? data.avatarUrl };
  const payload = token ? decodeJwt(token) : null;

  return (
    <ScrollView className="flex-1 bg-canvas" contentContainerClassName="gap-4 p-3 pb-6">
      <View className="items-center gap-2 py-3">
        {profile && <AvatarEditor profile={profile} onChanged={setNewAvatar} />}
        <Heading level="h3" className="text-center">
          {profile?.nickname ?? user?.email}
        </Heading>
        <Caption>{user?.email}</Caption>
        <Badge text="Administrador" tone="secondary" />
      </View>

      <Card>
        <Heading level="h3">Sesión</Heading>
        <Body muted>
          {payload
            ? `Se renueva sola cada vez que abres la app. Vence el ${formatDateTime(new Date(payload.exp * 1000).toISOString())} si no la usas antes`
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
