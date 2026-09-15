import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Keyboard, Pressable, Text, View } from 'react-native';
import Button from '../src/components/Button';
import Field from '../src/components/Field';
import { useSession } from '../src/session/context';

/** Los datos que captura este formulario. */
type LoginForm = { email: string; password: string };

export default function Login() {
  const { login } = useSession();

  // `control` conecta los campos, `handleSubmit` valida antes de enviar y
  // `formState` trae los errores y si se está enviando en este momento.
  const { control, handleSubmit, setError, formState } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  });

  const submit = async ({ email, password }: LoginForm) => {
    try {
      await login(email, password);
      // No hay que navegar: al cambiar la sesión, el layout raíz muestra las
      // pantallas privadas automáticamente.
    } catch (error) {
      // `root` es el error del formulario completo (credenciales malas, servidor
      // caído...), a diferencia del error de un campo concreto.
      setError('root', { message: (error as Error).message });
    }
  };

  return (
    // Tocar fuera de los campos cierra el teclado (si no, tapa el botón Entrar).
    <Pressable className="flex-1 bg-base" onPress={Keyboard.dismiss}>
      <View className="flex-1 justify-center gap-5 p-6">
      <View className="gap-1">
        <Text className="text-2xl font-bold text-white">NFHunter</Text>
        <Text className="text-neutral-400">Entra para seguir la cacería</Text>
      </View>

      <Field
        control={control}
        name="email"
        label="Correo"
        keyboardType="email-address"
        placeholder="tucorreo@ejemplo.com"
        rules={{
          required: 'El correo es obligatorio',
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Correo inválido' },
          maxLength: { value: 100, message: 'Máximo 100 caracteres' },
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
          maxLength: { value: 72, message: 'Máximo 72 caracteres' },
        }}
      />

      {!!formState.errors.root && (
        <Text className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-center text-red-200">
          {formState.errors.root.message}
        </Text>
      )}

      <Button
        text={formState.isSubmitting ? 'Entrando…' : 'Entrar'}
        onPress={handleSubmit(submit)}
        disabled={formState.isSubmitting}
      />

      <Link href="/register" className="text-center font-semibold text-neutral-100">
        ¿No tienes cuenta? Regístrate
      </Link>
      </View>
    </Pressable>
  );
}
