import type { ReactElement } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { ListScreenToken } from '../theme/Token';
import { colors } from '../theme/tokens';
import { plural } from '../utils/format';
import Notice from './Notice';
import { Caption } from './Typography';

/**
 * Esqueleto de las listas del panel: contador, buscador y filtros arriba,
 * tarjetas en el medio y un estado vacío que dice por qué no hay nada.
 * Deslizar hacia abajo recarga.
 */
export default function ListScreen<T extends { id: string }>({
  items,
  total,
  noun,
  renderItem,
  controls,
  error,
  isRefreshing,
  onRefresh,
  empty,
}: {
  items: T[];
  /** Cuántos hay sin filtrar, para el "3 de 10". */
  total: number;
  /** La entidad en singular y plural: ['evento', 'eventos']. */
  noun: readonly [string, string];
  renderItem: (item: T) => ReactElement;
  /** Buscador y filtros. */
  controls: ReactElement;
  error: string | null;
  isRefreshing: boolean;
  onRefresh: () => void;
  empty: ReactElement;
}) {
  return (
    <FlatList
      className={ListScreenToken.container}
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => renderItem(item)}
      contentContainerClassName={ListScreenToken.content}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
      ListHeaderComponent={
        <View className={ListScreenToken.header}>
          {controls}
          <Notice message={error} />
          <Caption>
            {items.length === total
              ? plural(total, noun[0], noun[1])
              : `${items.length} de ${plural(total, noun[0], noun[1])}`}
          </Caption>
        </View>
      }
      ListEmptyComponent={error ? null : empty}
    />
  );
}
