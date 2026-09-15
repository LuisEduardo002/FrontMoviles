import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Keyboard, Pressable, ScrollView, Text, View } from 'react-native';
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
    // Tocar fuera de los campos cierra el teclado; arrastrar también lo oculta.
    <Pressable className="flex-1 bg-base" onPress={Keyboard.dismiss}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 p-6"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
      <View className="gap-1">
        <Text className="text-2xl font-bold text-white">Crear cuenta</Text>
        <Text className="text-neutral-400">
          Crea tu cuenta para empezar a rastrear tags y sumar puntos.
        </Text>
      </View>

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
        <Text className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-center text-red-200">
          {formState.errors.root.message}
        </Text>
      )}

      <Button
        text={formState.isSubmitting ? 'Creando…' : 'Crear cuenta'}
        onPress={handleSubmit(submit)}
        disabled={formState.isSubmitting}
      />

      <Link href="/login" className="text-center font-semibold text-neutral-100">
        ¿Ya tienes cuenta? Inicia sesión
      </Link>
      </ScrollView>
    </Pressable>
  );
}
