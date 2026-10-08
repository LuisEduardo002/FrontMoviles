import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { createUser } from '@/api/users';
import { hapticError, hapticSuccess } from '@/utils/haptics';
import { USER_DEFAULTS, formToCreateUser, type UserFormValues } from '@/utils/userForm';

/**
 * Formulario de crear usuario. Al guardar vuelve a la lista; si el servidor
 * lo rechaza (correo o apodo repetido), su mensaje queda en `error`.
 */
export function useCreateUser() {
  const { control, handleSubmit, setError, formState } = useForm<UserFormValues>({
    defaultValues: USER_DEFAULTS,
  });

  const submit = handleSubmit(async (values) => {
    try {
      await createUser(formToCreateUser(values));
      hapticSuccess();
      router.back();
    } catch (failure) {
      hapticError();
      setError('root', { message: (failure as Error).message });
    }
  }, hapticError);

  return {
    control,
    submit,
    error: formState.errors.root?.message,
    isSubmitting: formState.isSubmitting,
  };
}
