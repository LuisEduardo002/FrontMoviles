import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import Button from '../src/components/Button';
import Field from '../src/components/Field';
import Notice from '../src/components/Notice';
import { FormScreen } from '../src/components/Screen';
import { Body } from '../src/components/Typography';
import { useSession } from '../src/session/context';
import { colors } from '../src/theme/tokens';
import { hapticError, hapticSuccess } from '../src/utils/haptics';

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
      hapticSuccess();
      // No hay que navegar: al cambiar la sesión, el layout raíz muestra las
      // pantallas privadas automáticamente.
    } catch (error) {
      hapticError();
      // `root` es el error del formulario completo (credenciales malas, servidor
      // caído...), a diferencia del error de un campo concreto.
      setError('root', { message: (error as Error).message });
    }
  };

  return (
    <FormScreen centered>
      <View className="items-center gap-2 py-5">
        <Text
          className="font-data-black text-display text-primary"
          style={{ textShadowColor: colors.primary, textShadowRadius: 16 }}>
          NFHunter
        </Text>
        <Body muted className="text-center">
          Cada esquina guarda una historia. Cada tag, un trofeo.
        </Body>
      </View>

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
          maxLength: { value: 100, message: 'Máximo 100 caracteres' },
        }}
      />
      <Field
        control={control}
        name="password"
        label="Contraseña"
        secureTextEntry
        autoComplete="current-password"
        placeholder="••••••••"
        returnKeyType="go"
        onSubmitEditing={handleSubmit(submit, hapticError)}
        rules={{
          required: 'La contraseña es obligatoria',
          maxLength: { value: 72, message: 'Máximo 72 caracteres' },
        }}
      />

      <Notice message={formState.errors.root?.message} />

      <Button
        text={formState.isSubmitting ? 'Entrando…' : 'Entrar'}
        onPress={handleSubmit(submit, hapticError)}
        disabled={formState.isSubmitting}
      />

      <Pressable
        onPress={() => router.push('/register')}
        accessibilityRole="link"
        className="items-center py-2">
        <Text className="font-body text-body text-ink/70">
          ¿No tienes cuenta? <Text className="font-body-semibold text-secondary">Crear cuenta</Text>
        </Text>
      </Pressable>
    </FormScreen>
  );
}
