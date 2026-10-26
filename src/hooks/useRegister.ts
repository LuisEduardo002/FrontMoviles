import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useSession } from '@/session/context';
import { hapticError, hapticSuccess } from '@/utils/haptics';

export interface RegisterFormValues {
  nickname: string;
  email: string;
  password: string;
  /** No se envía: solo sirve para verificar que no hubo errata. */
  confirmation: string;
}

/** Formulario de crear cuenta. Al registrarse la sesión queda abierta. */
export function useRegister() {
  const { register } = useSession();
  const { control, handleSubmit, setError, getValues, formState } = useForm<RegisterFormValues>({
    defaultValues: { nickname: '', email: '', password: '', confirmation: '' },
  });

  const submit = handleSubmit(async ({ nickname, email, password }) => {
    try {
      await register(nickname, email, password);
      hapticSuccess();
    } catch (failure) {
      hapticError();
      setError('root', { message: (failure as Error).message });
    }
  }, hapticError);

  return {
    control,
    submit,
    /** Para validar que la confirmación coincide. */
    getPassword: () => getValues('password'),
    // Si se llegó desde el login, volver es regresar; si se abrió directo, reemplazar
    goToLogin: () => (router.canGoBack() ? router.back() : router.replace('/login')),
    error: formState.errors.root?.message,
    isSubmitting: formState.isSubmitting,
  };
}
