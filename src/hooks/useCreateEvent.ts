import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { createEvent } from '@/api/events';
import { EVENT_DEFAULTS, formToCreateEvent, type EventFormValues } from '@/utils/eventForm';
import { hapticError, hapticSuccess } from '@/utils/haptics';

/**
 * Formulario de crear evento. Al guardar vuelve a la lista, que ya muestra
 * el evento nuevo; si falla, deja el mensaje del servidor en `error`.
 */
export function useCreateEvent() {
  const { control, handleSubmit, setError, getValues, formState } = useForm<EventFormValues>({
    defaultValues: EVENT_DEFAULTS,
  });

  const submit = handleSubmit(async (values) => {
    try {
      await createEvent(formToCreateEvent(values));
      hapticSuccess();
      router.back();
    } catch (failure) {
      hapticError();
      setError('root', { message: (failure as Error).message });
    }
  }, hapticError);

  return {
    control,
    getStartDate: () => getValues('startDate'),
    submit,
    error: formState.errors.root?.message,
    isSubmitting: formState.isSubmitting,
  };
}
