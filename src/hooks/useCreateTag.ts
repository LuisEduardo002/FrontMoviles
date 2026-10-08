import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { createTag } from '@/api/tags';
import { useEvents } from '@/hooks/useEvents';
import { hapticError, hapticSuccess } from '@/utils/haptics';
import { TAG_DEFAULTS, formToCreateTag, type TagFormValues } from '@/utils/tagForm';

/**
 * Formulario de crear tag, con los eventos para elegir. Sin eventos el
 * formulario sigue sirviendo: el tag queda "Sin evento".
 */
export function useCreateTag() {
  const { events } = useEvents();
  const { control, handleSubmit, setError, formState } = useForm<TagFormValues>({
    defaultValues: TAG_DEFAULTS,
  });

  const submit = handleSubmit(async (values) => {
    try {
      await createTag(formToCreateTag(values));
      hapticSuccess();
      router.back();
    } catch (failure) {
      hapticError();
      setError('root', { message: (failure as Error).message });
    }
  }, hapticError);

  return {
    control,
    events,
    submit,
    error: formState.errors.root?.message,
    isSubmitting: formState.isSubmitting,
  };
}
