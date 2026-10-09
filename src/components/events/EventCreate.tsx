import { createEvent } from '@/api/events';
import EventForm from '@/components/events/EventForm';
import Button from '@/components/ui/Button';
import Notice from '@/components/ui/Notice';
import { FormScreen } from '@/components/ui/Screen';
import { useCreateForm } from '@/hooks/useCreateForm';
import { EVENT_DEFAULTS, formToCreateEvent, type EventFormValues } from '@/utils/eventForm';

/** Pantalla de crear evento. La lógica vive en `useCreateForm`. */
export default function EventCreate() {
  const { control, getValues, submit, error, isSubmitting } = useCreateForm<EventFormValues, ReturnType<typeof formToCreateEvent>>({
    defaults: EVENT_DEFAULTS,
    toPayload: formToCreateEvent,
    create: createEvent,
  });

  return (
    <FormScreen>
      <EventForm control={control} getStartDate={() => getValues('startDate')} />
      <Notice message={error} />
      <Button text={isSubmitting ? 'Creando…' : 'Crear evento'} onPress={submit} disabled={isSubmitting} />
    </FormScreen>
  );
}
