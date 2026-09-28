import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Pressable, Text } from 'react-native';
import Button from '../src/components/Button';
import Field from '../src/components/Field';
import Notice from '../src/components/Notice';
import { FormScreen } from '../src/components/Screen';
import { Body } from '../src/components/Typography';
import { useSession } from '../src/session/context';
import { hapticError, hapticSuccess } from '../src/utils/haptics';

type RegisterForm = { nickname: string; email: string; password: string; confirmation: string };

export default function Register() {
  const { register } = useSession();
  const { control, handleSubmit, setError, getValues, formState } = useForm<RegisterForm>({
    defaultValues: { nickname: '', email: '', password: '', confirmation: '' },
  });

  // `confirmation` no se envía: solo sirve para verificar que no hubo errata.
  const submit = async ({ nickname, email, password }: RegisterForm) => {
    try {
      await register(nickname, email, password);
      hapticSuccess();
    } catch (error) {
      hapticError();
      setError('root', { message: (error as Error).message });
    }
  };

  // Si se llegó desde el login, volver es regresar; si se abrió directo, reemplazar.
  const goToLogin = () => (router.canGoBack() ? router.back() : router.replace('/login'));

  return (
    <FormScreen>
      <Body muted>Crea tu cuenta para empezar a rastrear tags y sumar puntos.</Body>

      <Field
        control={control}
        name="nickname"
        label="Apodo"
        hint="Así te verán los demás jugadores."
        placeholder="cazador_nocturno"
        rules={{
          required: 'El apodo es obligatorio',
          minLength: { value: 2, message: 'Mínimo 2 caracteres' },
          // La columna es VARCHAR(50): más largo lo rechaza la base de datos.
          maxLength: { value: 50, message: 'Máximo 50 caracteres' },
        }}
      />
      <Field
        control={control}
        name="email"
        label="Correo"
        keyboardType="email-address"
        autoComplete="email"
        placeholder="tucorreo@ejemplo.com"
        rules={{
          required: 'El correo es obligatorio',
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Correo inválido' },
        }}
      />
      <Field
        control={control}
        name="password"
        label="Contraseña"
        secureTextEntry
        autoComplete="new-password"
        placeholder="••••••••"
        rules={{
          required: 'La contraseña es obligatoria',
          // El backend todavía no valida el largo (no tiene ValidationPipe), así
          // que este mínimo es nuestro: es la única barrera contra claves de
          // tres letras.
          minLength: { value: 8, message: 'Mínimo 8 caracteres' },
        }}
      />
      <Field
        control={control}
        name="confirmation"
        label="Confirmar contraseña"
        secureTextEntry
        placeholder="••••••••"
        rules={{
          required: 'Confirma la contraseña',
          validate: (value) => value === getValues('password') || 'Las contraseñas no coinciden',
        }}
      />

      <Notice message={formState.errors.root?.message} />

      <Button
        text={formState.isSubmitting ? 'Creando…' : 'Crear cuenta'}
        onPress={handleSubmit(submit, hapticError)}
        disabled={formState.isSubmitting}
      />

      <Pressable onPress={goToLogin} accessibilityRole="link" className="items-center py-2">
        <Text className="font-body text-body text-ink/70">
          ¿Ya tienes cuenta? <Text className="font-body-semibold text-secondary">Inicia sesión</Text>
        </Text>
      </Pressable>
    </FormScreen>
  );
}
