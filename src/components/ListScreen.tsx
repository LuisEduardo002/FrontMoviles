import type { ReactElement } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { colors } from '../theme/tokens';
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
  /** Plural de la entidad: "eventos", "tags". */
  noun: string;
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
      className="flex-1 bg-canvas"
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => renderItem(item)}
      contentContainerClassName="gap-3 p-3 pb-6"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
      ListHeaderComponent={
        <View className="gap-3 pb-1">
          {controls}
          <Notice message={error} />
          <Caption>
            {items.length === total ? `${total} ${noun}` : `${items.length} de ${total} ${noun}`}
          </Caption>
        </View>
      }
      ListEmptyComponent={error ? null : empty}
    />
  );
}
