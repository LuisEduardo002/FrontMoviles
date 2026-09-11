import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { ScrollView, Text } from 'react-native';
import Button from '../src/components/Button';
import Field from '../src/components/Field';
import { useSession } from '../src/session/context';

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
    } catch (error) {
      setError('root', { message: (error as Error).message });
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="gap-5 p-6"
      keyboardShouldPersistTaps="handled">
      <Text className="text-neutral-500">
        Crea tu cuenta para empezar a rastrear tags y sumar puntos.
      </Text>

      <Field
        control={control}
        name="nickname"
        label="Apodo"
        autoCapitalize="none"
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

      {!!formState.errors.root && (
        <Text className="rounded-lg bg-red-50 p-3 text-center text-red-700">
          {formState.errors.root.message}
        </Text>
      )}

      <Button
        text={formState.isSubmitting ? 'Creando…' : 'Crear cuenta'}
        onPress={handleSubmit(submit)}
        disabled={formState.isSubmitting}
      />

      <Link href="/login" className="text-center text-blue-600">
        ¿Ya tienes cuenta? Inicia sesión
      </Link>
    </ScrollView>
  );
}
