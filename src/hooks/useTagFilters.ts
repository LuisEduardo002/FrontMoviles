import { useMemo, useState } from 'react';
import type { NfcTag } from '@/types';

export type TagVisibilityFilter = 'ALL' | 'VISIBLE' | 'HIDDEN';

export const TAG_VISIBILITY_FILTERS = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Visibles', value: 'VISIBLE' },
  { label: 'Ocultos', value: 'HIDDEN' },
] as const;

/** Búsqueda por código, nombre o pista y filtro por visibilidad. */
export function useTagFilters(tags: NfcTag[]) {
  const [query, setQuery] = useState('');
  const [visibility, setVisibility] = useState<TagVisibilityFilter>('ALL');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tags.filter((tag) => {
      if (visibility === 'VISIBLE' && tag.isHidden) return false;
      if (visibility === 'HIDDEN' && !tag.isHidden) return false;
      if (!q) return true;
      return [tag.code, tag.name, tag.description ?? '', tag.clueText ?? ''].some((field) =>
        field.toLowerCase().includes(q),
      );
    });
  }, [tags, query, visibility]);

  return { query, setQuery, visibility, setVisibility, filtered };
}
