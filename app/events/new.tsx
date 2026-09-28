import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { createEvent } from '../../src/api/events';
import Button from '../../src/components/Button';
import EventForm, { EVENT_DEFAULTS, type EventFormValues } from '../../src/components/EventForm';
import Notice from '../../src/components/Notice';
import { FormScreen } from '../../src/components/Screen';
import { toApiDate } from '../../src/utils/format';
import { hapticError, hapticSuccess } from '../../src/utils/haptics';

/** Crear evento. Al guardar vuelve a la lista, que ya lo muestra. */
export default function NewEvent() {
  const { control, handleSubmit, setError, getValues, formState } = useForm<EventFormValues>({
    defaultValues: EVENT_DEFAULTS,
  });

  const submit = async (values: EventFormValues) => {
    try {
      await createEvent({
        name: values.name.trim(),
        description: values.description.trim() || undefined,
        startDate: toApiDate(values.startDate.trim()),
        endDate: toApiDate(values.endDate.trim()),
        isActive: values.isActive,
      });
      hapticSuccess();
      router.back();
    } catch (failure) {
      hapticError();
      setError('root', { message: (failure as Error).message });
    }
  };

  return (
    <FormScreen>
      <EventForm control={control} getStartDate={() => getValues('startDate')} />
      <Notice message={formState.errors.root?.message} />
      <Button
        text={formState.isSubmitting ? 'Creando…' : 'Crear evento'}
        onPress={handleSubmit(submit, hapticError)}
        disabled={formState.isSubmitting}
      />
    </FormScreen>
  );
}
