import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useSession } from '@/session/context';
import { hapticError, hapticSuccess } from '@/utils/haptics';

export interface LoginFormValues {
  email: string;
  password: string;
}

/**
 * Formulario de ingreso. No navega al entrar: al cambiar la sesión, el
 * layout raíz muestra las pantallas privadas automáticamente.
 */
export function useLogin() {
  const { login } = useSession();
  const { control, handleSubmit, setError, formState } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' },
  });

  const submit = handleSubmit(async ({ email, password }) => {
    try {
      await login(email, password);
      hapticSuccess();
    } catch (failure) {
      hapticError();
      // `root` es el error del formulario completo (credenciales malas,
      // servidor caído...), a diferencia del error de un campo concreto.
      setError('root', { message: (failure as Error).message });
    }
  }, hapticError);

  return {
    control,
    submit,
    goToRegister: () => router.push('/register'),
    error: formState.errors.root?.message,
    isSubmitting: formState.isSubmitting,
  };
}
