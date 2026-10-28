import { Text, View } from 'react-native';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { Caption, Heading } from '@/components/ui/Typography';
import { UserCardToken } from '@/theme/Token';
import type { AdminUser } from '@/types';

/** Un usuario en la lista del admin: foto, apodo, correo, rol, puntos y nivel. */
export default function UserCard({ user, onOpen }: { user: AdminUser; onOpen: () => void }) {
  return (
    <Card onPress={onOpen}>
      <View className={UserCardToken.identity}>
        <Avatar nickname={user.nickname} url={user.avatarUrl} />
        <View className={UserCardToken.identityText}>
          <Heading level="h3" numberOfLines={1}>
            {user.nickname}
          </Heading>
          <Caption numberOfLines={1}>{user.email}</Caption>
        </View>
      </View>
      <View className={UserCardToken.meta}>
        <Badge
          text={user.role === 'ADMIN' ? 'Admin' : 'Jugador'}
          tone={user.role === 'ADMIN' ? 'secondary' : 'muted'}
        />
        <Text className={UserCardToken.points}>{user.totalPoints} pts</Text>
        {!!user.levelTitle && <Caption>· {user.levelTitle}</Caption>}
      </View>
    </Card>
  );
}
