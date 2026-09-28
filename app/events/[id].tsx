import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { deleteEvent, getEvent, updateEvent } from '../../src/api/events';
import Button from '../../src/components/Button';
import EventForm, { EVENT_DEFAULTS, type EventFormValues } from '../../src/components/EventForm';
import Notice from '../../src/components/Notice';
import { DangerZone, ErrorScreen, FormScreen, LoadingScreen } from '../../src/components/Screen';
import type { AdminEvent, UpdateEventDto } from '../../src/types';
import { confirmDestructive } from '../../src/utils/dialog';
import { toApiDate, toDateInputValue } from '../../src/utils/format';
import { hapticError, hapticSuccess } from '../../src/utils/haptics';

const toForm = (event: AdminEvent): EventFormValues => ({
  name: event.name,
  description: event.description ?? '',
  startDate: toDateInputValue(event.startDate),
  endDate: toDateInputValue(event.endDate),
  isActive: event.isActive,
});

/**
 * Detalle + edición + eliminación de un evento.
 * Precarga los datos y al guardar solo envía lo que cambió.
 */
export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [original, setOriginal] = useState<AdminEvent | null>(null);
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
        const event = await getEvent(id);
        setOriginal(event);
        reset(toForm(event));
      } catch (failure) {
        setLoadError((failure as Error).message);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id, reset]);

  const submit = async (values: EventFormValues) => {
    if (!original) return;
    const { dirtyFields } = formState;
    const patch: UpdateEventDto = {};
    if (dirtyFields.name) patch.name = values.name.trim();
    if (dirtyFields.description) patch.description = values.description.trim();
    if (dirtyFields.startDate) patch.startDate = toApiDate(values.startDate.trim());
    if (dirtyFields.endDate) patch.endDate = toApiDate(values.endDate.trim());
    if (dirtyFields.isActive) patch.isActive = values.isActive;

    try {
      const updated = await updateEvent(original.id, patch);
      setOriginal(updated);
      reset(toForm(updated));
      setSaved(true);
      hapticSuccess();
    } catch (failure) {
      hapticError();
      setError('root', { message: (failure as Error).message });
    }
  };

  const remove = async () => {
    if (!original) return;
    const confirmed = await confirmDestructive(
      'Eliminar evento',
      `¿Eliminar "${original.name}"? Sus tags quedarán sin evento. Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;
    try {
      setDeleting(true);
      await deleteEvent(original.id);
      hapticSuccess();
      router.back();
    } catch (failure) {
      setDeleting(false);
      hapticError();
      setError('root', { message: (failure as Error).message });
    }
  };

  if (isLoading) return <LoadingScreen />;
  if (loadError || !original) return <ErrorScreen message={loadError ?? 'Evento no encontrado.'} />;

  const busy = formState.isSubmitting || isDeleting;

  return (
    <FormScreen>
      <Stack.Screen options={{ title: original.name }} />
      <EventForm control={control} getStartDate={() => getValues('startDate')} />

      <Notice message={formState.errors.root?.message} />
      {saved && !formState.isDirty && <Notice tone="success" message="Cambios guardados." />}
      <Button
        text={formState.isSubmitting ? 'Guardando…' : 'Guardar cambios'}
        onPress={handleSubmit(submit, hapticError)}
        disabled={!formState.isDirty || busy}
      />

      <DangerZone
        description="Eliminar el evento no borra sus tags: quedan sin evento asignado."
        buttonText={isDeleting ? 'Eliminando…' : 'Eliminar evento'}
        onPress={() => void remove()}
        disabled={busy}
      />
    </FormScreen>
  );
}
