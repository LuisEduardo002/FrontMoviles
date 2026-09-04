import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import Button from '../src/layout/Button';
import { useAuth } from '../auth';
import Field from '../src/components/Field';

type Form = { email: string; password: string };

export default function Login() {
  const { signIn } = useAuth();
  const { control, handleSubmit, setError, formState } = useForm<Form>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async ({ email, password }: Form) => {
    try {
      await signIn(email, password);
    } catch (e) {
      setError('root', { message: (e as Error).message });
    }
  };

  return (
    <View className="flex-1 justify-center gap-4 p-6">
      <Field
        control={control}
        name="email"
        label="Correo"
        keyboardType="email-address"
        placeholder="tu@correo.com"
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
        rules={{ required: 'La contraseña es obligatoria' }}
      />

      {!!formState.errors.root && (
        <Text className="text-center text-red-600">{formState.errors.root.message}</Text>
      )}

      <Button
        text={formState.isSubmitting ? 'Entrando...' : 'Entrar'}
        onPress={handleSubmit(onSubmit)}
        disabled={formState.isSubmitting}
      />
      <Link href="/register" className="text-center text-blue-600">
        ¿No tienes cuenta? Regístrate
      </Link>
    </View>
  );
}
