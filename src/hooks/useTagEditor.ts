import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { listEvents } from '@/api/events';
import { deleteTag, getTag, updateTag } from '@/api/tags';
import type { AdminEvent, NfcTag } from '@/types';
import { confirmDestructive } from '@/utils/dialog';
import { hapticError, hapticSuccess } from '@/utils/haptics';
import { TAG_DEFAULTS, formToUpdateTag, tagToForm, type TagFormValues } from '@/utils/tagForm';

/**
 * Detalle editable de un tag: lo carga junto con los eventos para elegir,
 * guarda solo lo que cambió y lo elimina tras confirmar.
 */
export function useTagEditor(id: string) {
  const [tag, setTag] = useState<NfcTag | null>(null);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDeleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const { control, handleSubmit, setError, reset, formState } = useForm<TagFormValues>({
    defaultValues: TAG_DEFAULTS,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [loaded, eventList] = await Promise.all([getTag(id), listEvents().catch(() => [])]);
        setEvents(eventList);
        setTag(loaded);
        reset(tagToForm(loaded));
      } catch (failure) {
        setLoadError((failure as Error).message);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id, reset]);

  const save = handleSubmit(async (values) => {
    if (!tag) return;
    try {
      // El PATCH de tags no devuelve el tag, así que se vuelve a pedir.
      await updateTag(tag.id, formToUpdateTag(values, formState.dirtyFields));
      const updated = await getTag(tag.id);
      setTag(updated);
      reset(tagToForm(updated));
      setSaved(true);
      hapticSuccess();
    } catch (failure) {
      hapticError();
      setError('root', { message: (failure as Error).message });
    }
  }, hapticError);

  const remove = async () => {
    if (!tag) return;
    const confirmed = await confirmDestructive(
      'Eliminar tag',
      `¿Eliminar el tag ${tag.code}? Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;
    try {
      setDeleting(true);
      await deleteTag(tag.id);
      hapticSuccess();
      router.back();
    } catch (failure) {
      setDeleting(false);
      hapticError();
      setError('root', { message: (failure as Error).message });
    }
  };

  return {
    tag,
    events,
    isLoading,
    loadError,
    control,
    save,
    remove,
    error: formState.errors.root?.message,
    isSubmitting: formState.isSubmitting,
    isDeleting,
    isDirty: formState.isDirty,
    saved: saved && !formState.isDirty,
  };
}
