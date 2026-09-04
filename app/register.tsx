import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import Button from '../src/layout/Button';
import { useAuth } from '../auth';
import Field from '../src/components/Field';

type Form = { name: string; email: string; password: string; confirm: string };

export default function Register() {
  const { signUp } = useAuth();
  const { control, handleSubmit, setError, getValues, formState } = useForm<Form>({
    defaultValues: { name: '', email: '', password: '', confirm: '' },
  });

  const onSubmit = async ({ name, email, password }: Form) => {
    try {
      await signUp(name, email, password);
    } catch (e) {
      setError('root', { message: (e as Error).message });
    }
  };

  return (
    <View className="flex-1 justify-center gap-4 p-6">
      <Field
        control={control}
        name="name"
        label="Nombre"
        autoCapitalize="words"
        rules={{
          required: 'El nombre es obligatorio',
          minLength: { value: 2, message: 'Mínimo 2 caracteres' },
        }}
      />
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
        rules={{
          required: 'La contraseña es obligatoria',
          minLength: { value: 6, message: 'Mínimo 6 caracteres' },
        }}
      />
      <Field
        control={control}
        name="confirm"
        label="Confirmar contraseña"
        secureTextEntry
        rules={{
          required: 'Confirma la contraseña',
          validate: (v) => v === getValues('password') || 'Las contraseñas no coinciden',
        }}
      />

      {!!formState.errors.root && (
        <Text className="text-center text-red-600">{formState.errors.root.message}</Text>
      )}

      <Button
        text={formState.isSubmitting ? 'Creando...' : 'Crear cuenta'}
        onPress={handleSubmit(onSubmit)}
        disabled={formState.isSubmitting}
      />
      <Link href="/login" className="text-center text-blue-600">
        ¿Ya tienes cuenta? Inicia sesión
      </Link>
    </View>
  );
}
