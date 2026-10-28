import { router } from 'expo-router';
import { listUsers } from '@/api/users';
import ListScreen from '@/components/ui/ListScreen';
import { EmptyState, LoadingScreen } from '@/components/ui/Screen';
import SearchBar from '@/components/ui/SearchBar';
import Segmented from '@/components/ui/Segmented';
import UserCard from '@/components/users/UserCard';
import { useFocusLoad } from '@/hooks/useFocusLoad';
import { useListFilter } from '@/hooks/useListFilter';
import { USER_ROLE_FILTER } from '@/utils/listFilters';

/** Lista de usuarios del admin con búsqueda (apodo, correo o nivel) + filtro por rol. */
export default function UserList() {
  const { data: users, isLoading, isRefreshing, error, refresh } = useFocusLoad(listUsers, []);
  const { query, setQuery, filter, setFilter, filtered } = useListFilter(users, USER_ROLE_FILTER);

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
          <Segmented options={USER_ROLE_FILTER.options} value={filter} onChange={setFilter} />
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
