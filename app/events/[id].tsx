import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { deleteEvent, getEvent, updateEvent } from '@/api/events';
import Button from '@/components/ui/Button';
import EventForm, { EVENT_DEFAULTS, type EventFormValues } from '@/components/events/EventForm';
import Notice from '@/components/ui/Notice';
import { DangerZone, ErrorScreen, FormScreen, LoadingScreen } from '@/components/ui/Screen';
import type { AdminEvent, UpdateEventDto } from '@/types';
import { confirmDestructive } from '@/utils/dialog';
import { toApiDate, toDateInputValue } from '@/utils/format';
import { hapticError, hapticSuccess } from '@/utils/haptics';
import PlayerEventDetail from '@/components/events/PlayerEventDetail';
import { useSession } from '@/session/context';

const toForm = (event: AdminEvent): EventFormValues => ({
  name: event.name,
  description: event.description ?? '',
  startDate: toDateInputValue(event.startDate),
  endDate: toDateInputValue(event.endDate),
  isActive: event.isActive,
});

/** El admin edita el evento; el jugador ve su horario y sus tags. */
export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useSession();
  return user?.role === 'ADMIN' ? <AdminEventDetail id={id} /> : <PlayerEventDetail id={id} />;
}

/**
 * Detalle + edición + eliminación de un evento.
 * Precarga los datos y al guardar solo envía lo que cambió.
 */
function AdminEventDetail({ id }: { id: string }) {
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
