import { useMemo, useState } from 'react';
import type { ListFilter } from '@/utils/listFilters';

/**
 * Búsqueda por texto y filtro de una lista, según la configuración de
 * `utils/listFilters`. `totalInFilter` es lo que pasa el filtro antes de la
 * búsqueda, para el "3 de 5".
 */
export function useListFilter<T, F extends string>(items: T[], config: ListFilter<T, F>) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<F>(config.initial);

  const inFilter = useMemo(
    () => items.filter((item) => config.matches(item, filter)),
    [items, config, filter],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const found = q
      ? inFilter.filter((item) => config.searchFields(item).some((field) => (field ?? '').toLowerCase().includes(q)))
      : inFilter;
    const { sort } = config;
    return sort ? [...found].sort((a, b) => sort(a, b, filter)) : found;
  }, [inFilter, config, query, filter]);

  return { query, setQuery, filter, setFilter, filtered, totalInFilter: inFilter.length };
}
