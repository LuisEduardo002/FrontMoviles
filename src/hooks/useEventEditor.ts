import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { deleteEvent, getEvent, updateEvent } from '@/api/events';
import type { AdminEvent } from '@/types';
import { confirmDestructive } from '@/utils/dialog';
import { EVENT_DEFAULTS, eventToForm, formToUpdateEvent, type EventFormValues } from '@/utils/eventForm';
import { hapticError, hapticSuccess } from '@/utils/haptics';

/**
 * Detalle editable de un evento: lo carga, guarda solo lo que cambió y lo
 * elimina tras confirmar.
 */
export function useEventEditor(id: string) {
  const [event, setEvent] = useState<AdminEvent | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDeleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const { control, handleSubmit, setError, reset, getValues, formState } = useForm<EventFormValues>({
    defaultValues: EVENT_DEFAULTS,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const loaded = await getEvent(id);
        setEvent(loaded);
        reset(eventToForm(loaded));
      } catch (failure) {
        setLoadError((failure as Error).message);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id, reset]);

  const save = handleSubmit(async (values) => {
    if (!event) return;
    try {
      const updated = await updateEvent(event.id, formToUpdateEvent(values, formState.dirtyFields));
      setEvent(updated);
      reset(eventToForm(updated));
      setSaved(true);
      hapticSuccess();
    } catch (failure) {
      hapticError();
      setError('root', { message: (failure as Error).message });
    }
  }, hapticError);

  const remove = async () => {
    if (!event) return;
    const confirmed = await confirmDestructive(
      'Eliminar evento',
      `¿Eliminar "${event.name}"? Sus tags quedarán sin evento. Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;
    try {
      setDeleting(true);
      await deleteEvent(event.id);
      hapticSuccess();
      router.back();
    } catch (failure) {
      setDeleting(false);
      hapticError();
      setError('root', { message: (failure as Error).message });
    }
  };

  return {
    event,
    isLoading,
    loadError,
    control,
    getStartDate: () => getValues('startDate'),
    save,
    remove,
    error: formState.errors.root?.message,
    isSubmitting: formState.isSubmitting,
    isDeleting,
    isDirty: formState.isDirty,
    // "Cambios guardados" solo hasta que se vuelva a editar algo
    saved: saved && !formState.isDirty,
  };
}
