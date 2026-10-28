import { router } from 'expo-router';
import { useForm, type DefaultValues, type FieldValues } from 'react-hook-form';
import { hapticError, hapticSuccess } from '@/utils/haptics';

/**
 * Formulario de crear algo (evento, tag, usuario). Al guardar vuelve a la
 * lista, que ya muestra lo nuevo; si el servidor lo rechaza, su mensaje
 * queda en `error`.
 */
export function useCreateForm<TForm extends FieldValues, TPayload>({
  defaults,
  toPayload,
  create,
}: {
  defaults: DefaultValues<TForm>;
  toPayload: (values: TForm) => TPayload;
  create: (payload: TPayload) => Promise<unknown>;
}) {
  const { control, handleSubmit, setError, getValues, formState } = useForm<TForm>({
    defaultValues: defaults,
  });

  const submit = handleSubmit(async (values) => {
    try {
      await create(toPayload(values));
      hapticSuccess();
      router.back();
    } catch (failure) {
      hapticError();
      setError('root', { message: (failure as Error).message });
    }
  }, hapticError);

  return {
    control,
    getValues,
    submit,
    error: formState.errors.root?.message,
    isSubmitting: formState.isSubmitting,
  };
}
