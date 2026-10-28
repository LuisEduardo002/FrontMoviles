import { Pressable, Text, View } from 'react-native';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Notice from '@/components/ui/Notice';
import { FormScreen } from '@/components/ui/Screen';
import { Body } from '@/components/ui/Typography';
import { useLogin } from '@/hooks/useLogin';
import { AuthToken } from '@/theme/Token';
import { colors } from '@/theme/tokens';

/** Pantalla de ingreso. La lógica vive en `useLogin`. */
export default function Login() {
  const { control, submit, goToRegister, error, isSubmitting } = useLogin();

  return (
    <FormScreen centered>
      <View className={AuthToken.header}>
        <Text
          className={AuthToken.brand}
          style={{ textShadowColor: colors.primary, textShadowRadius: AuthToken.brandGlowRadius }}>
          NFHunter
        </Text>
        <Body muted className={AuthToken.slogan}>
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
        onSubmitEditing={submit}
        rules={{
          required: 'La contraseña es obligatoria',
          maxLength: { value: 72, message: 'Máximo 72 caracteres' },
        }}
      />

      <Notice message={error} />

      <Button text={isSubmitting ? 'Entrando…' : 'Entrar'} onPress={submit} disabled={isSubmitting} />

      <Pressable onPress={goToRegister} accessibilityRole="link" className={AuthToken.switchLink}>
        <Text className={AuthToken.switchText}>
          ¿No tienes cuenta? <Text className={AuthToken.switchAction}>Crear cuenta</Text>
        </Text>
      </Pressable>
    </FormScreen>
  );
}
