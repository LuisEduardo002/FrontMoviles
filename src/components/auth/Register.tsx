import { Pressable, Text } from 'react-native';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Notice from '@/components/ui/Notice';
import { FormScreen } from '@/components/ui/Screen';
import { Body } from '@/components/ui/Typography';
import { useRegister } from '@/hooks/useRegister';

/** Pantalla de crear cuenta. La lógica vive en `useRegister`. */
export default function Register() {
  const { control, submit, getPassword, goToLogin, error, isSubmitting } = useRegister();

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
          validate: (value) => value === getPassword() || 'Las contraseñas no coinciden',
        }}
      />

      <Notice message={error} />

      <Button text={isSubmitting ? 'Creando…' : 'Crear cuenta'} onPress={submit} disabled={isSubmitting} />

      <Pressable onPress={goToLogin} accessibilityRole="link" className="items-center py-2">
        <Text className="font-body text-body text-ink/70">
          ¿Ya tienes cuenta? <Text className="font-body-semibold text-secondary">Inicia sesión</Text>
        </Text>
      </Pressable>
    </FormScreen>
  );
}
