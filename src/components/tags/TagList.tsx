import { router } from 'expo-router';
import TagCard from '@/components/tags/TagCard';
import ListScreen from '@/components/ui/ListScreen';
import { EmptyState, LoadingScreen } from '@/components/ui/Screen';
import SearchBar from '@/components/ui/SearchBar';
import Segmented from '@/components/ui/Segmented';
import { TAG_VISIBILITY_FILTERS, useTagFilters } from '@/hooks/useTagFilters';
import { useTags } from '@/hooks/useTags';

/** Lista de tags NFC del admin con búsqueda por texto + filtro por visibilidad. */
export default function TagList() {
  const { tags, eventName, isLoading, isRefreshing, error, refresh } = useTags();
  const { query, setQuery, visibility, setVisibility, filtered } = useTagFilters(tags);

  if (isLoading) return <LoadingScreen />;

  return (
    <ListScreen
      items={filtered}
      total={tags.length}
      noun={['tag', 'tags']}
      error={error}
      isRefreshing={isRefreshing}
      onRefresh={refresh}
      controls={
        <>
          <SearchBar value={query} onChange={setQuery} placeholder="Buscar por código, nombre o pista" />
          <Segmented options={TAG_VISIBILITY_FILTERS} value={visibility} onChange={setVisibility} />
        </>
      }
      renderItem={(tag) => (
        <TagCard
          tag={tag}
          eventName={eventName(tag)}
          onOpen={() => router.push({ pathname: '/tags/[id]', params: { id: tag.id } })}
        />
      )}
      empty={
        tags.length === 0 ? (
          <EmptyState icon="nfc-variant-off" title="Aún no hay tags" message="Crea el primero con el botón Nuevo." />
        ) : (
          <EmptyState
            icon="magnify-close"
            title="Sin resultados"
            message="Ningún tag coincide con la búsqueda o el filtro."
          />
        )
      }
    />
  );
}
