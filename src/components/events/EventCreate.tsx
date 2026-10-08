import EventForm from '@/components/events/EventForm';
import Button from '@/components/ui/Button';
import Notice from '@/components/ui/Notice';
import { FormScreen } from '@/components/ui/Screen';
import { useCreateEvent } from '@/hooks/useCreateEvent';

/** Pantalla de crear evento. La lógica vive en `useCreateEvent`. */
export default function EventCreate() {
  const { control, getStartDate, submit, error, isSubmitting } = useCreateEvent();

  return (
    <FormScreen>
      <EventForm control={control} getStartDate={getStartDate} />
      <Notice message={error} />
      <Button text={isSubmitting ? 'Creando…' : 'Crear evento'} onPress={submit} disabled={isSubmitting} />
    </FormScreen>
  );
}
