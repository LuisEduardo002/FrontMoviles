import { Pressable, Text, View } from 'react-native';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Notice from '@/components/ui/Notice';
import { FormScreen } from '@/components/ui/Screen';
import { Body } from '@/components/ui/Typography';
import { useLogin } from '@/hooks/useLogin';
import { colors } from '@/theme/tokens';

/** Pantalla de ingreso. La lógica vive en `useLogin`. */
export default function Login() {
  const { control, submit, goToRegister, error, isSubmitting } = useLogin();

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
        onSubmitEditing={submit}
        rules={{
          required: 'La contraseña es obligatoria',
          maxLength: { value: 72, message: 'Máximo 72 caracteres' },
        }}
      />

      <Notice message={error} />

      <Button text={isSubmitting ? 'Entrando…' : 'Entrar'} onPress={submit} disabled={isSubmitting} />

      <Pressable onPress={goToRegister} accessibilityRole="link" className="items-center py-2">
        <Text className="font-body text-body text-ink/70">
          ¿No tienes cuenta? <Text className="font-body-semibold text-secondary">Crear cuenta</Text>
        </Text>
      </Pressable>
    </FormScreen>
  );
}
