import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Button, StyleSheet, Text, View } from 'react-native';
import CustomBtn from '../src/layout/Button'
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

  const funTest = () => {
    console.log('Form import');
  }

  return (
    <View style={styles.container}>
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
        <Text style={styles.error}>{formState.errors.root.message}</Text>
      )}

      <Button
        title={formState.isSubmitting ? 'Entrando...' : 'Entrar'}
        onPress={handleSubmit(onSubmit)}
        disabled={formState.isSubmitting}
      />
      <CustomBtn
        text={'Botton custom'}
        variant={'asdf'}
        onPress={funTest}
      ></CustomBtn>
      <Link href="/register" style={styles.link}>
        ¿No tienes cuenta? Regístrate
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 16 },
  error: { color: '#c00', textAlign: 'center' },
  link: { textAlign: 'center', color: '#06c' },
});
