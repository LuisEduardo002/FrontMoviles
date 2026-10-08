import { router } from 'expo-router';
import ListScreen from '@/components/ui/ListScreen';
import { EmptyState, LoadingScreen } from '@/components/ui/Screen';
import SearchBar from '@/components/ui/SearchBar';
import Segmented from '@/components/ui/Segmented';
import UserCard from '@/components/users/UserCard';
import { USER_ROLE_FILTERS, useUserFilters } from '@/hooks/useUserFilters';
import { useUsers } from '@/hooks/useUsers';

/** Lista de usuarios del admin con búsqueda (apodo, correo o nivel) + filtro por rol. */
export default function UserList() {
  const { users, isLoading, isRefreshing, error, refresh } = useUsers();
  const { query, setQuery, role, setRole, filtered } = useUserFilters(users);

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
          <Segmented options={USER_ROLE_FILTERS} value={role} onChange={setRole} />
        </>
      }
      renderItem={(user) => (
        <UserCard user={user} onOpen={() => router.push({ pathname: '/users/[id]', params: { id: user.id } })} />
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
