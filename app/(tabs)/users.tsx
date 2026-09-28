import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { listUsers } from '../../src/api/users';
import Avatar from '../../src/components/Avatar';
import Badge from '../../src/components/Badge';
import Card from '../../src/components/Card';
import ListScreen from '../../src/components/ListScreen';
import { EmptyState, LoadingScreen } from '../../src/components/Screen';
import SearchBar from '../../src/components/SearchBar';
import Segmented from '../../src/components/Segmented';
import { Caption, Heading } from '../../src/components/Typography';
import { useFocusLoad } from '../../src/hooks/useFocusLoad';
import type { AdminUser, Role } from '../../src/types';

type Filter = 'ALL' | Role;

const FILTERS = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Jugadores', value: 'USER' },
  { label: 'Admins', value: 'ADMIN' },
] as const;

/** Lista de usuarios con búsqueda (apodo, correo o nivel) + filtro por rol. */
export default function Users() {
  const { data: users, isLoading, isRefreshing, error, refresh } = useFocusLoad(listUsers, []);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('ALL');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (filter !== 'ALL' && u.role !== filter) return false;
      if (!q) return true;
      return [u.nickname, u.email, u.levelTitle ?? ''].some((field) => field.toLowerCase().includes(q));
    });
  }, [users, query, filter]);

  if (isLoading) return <LoadingScreen />;

  return (
    <ListScreen
      items={filtered}
      total={users.length}
      noun={['usuario', 'usuarios']}
      error={error}
      isRefreshing={isRefreshing}
      onRefresh={refresh}
      controls={
        <>
          <SearchBar value={query} onChange={setQuery} placeholder="Buscar por apodo, correo o nivel" />
          <Segmented options={FILTERS} value={filter} onChange={setFilter} />
        </>
      }
      renderItem={(user) => (
        <UserCard
          user={user}
          onOpen={() => router.push({ pathname: '/users/[id]', params: { id: user.id } })}
        />
      )}
      empty={
        <EmptyState
          icon="account-search"
          title="Sin resultados"
          message="Ningún usuario coincide con la búsqueda o el filtro."
        />
      }
    />
  );
}

function UserCard({ user, onOpen }: { user: AdminUser; onOpen: () => void }) {
  return (
    <Card onPress={onOpen}>
      <View className="flex-row items-center gap-3">
        <Avatar nickname={user.nickname} url={user.avatarUrl} />
        <View className="flex-1 gap-1">
          <Heading level="h3" numberOfLines={1}>
            {user.nickname}
          </Heading>
          <Caption numberOfLines={1}>{user.email}</Caption>
        </View>
      </View>
      <View className="flex-row flex-wrap items-center gap-2">
        <Badge text={user.role === 'ADMIN' ? 'Admin' : 'Jugador'} tone={user.role === 'ADMIN' ? 'secondary' : 'muted'} />
        <Text className="font-data text-caption text-primary">{user.totalPoints} pts</Text>
        {!!user.levelTitle && <Caption>· {user.levelTitle}</Caption>}
      </View>
    </Card>
  );
}
