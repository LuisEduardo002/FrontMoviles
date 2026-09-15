import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Keyboard, Pressable, ScrollView, Text, View } from 'react-native';
import Button from '../../src/components/Button';
import Field from '../../src/components/Field';
import FormError from '../../src/components/FormError';
import RoleSegment from '../../src/components/RoleSegment';
import { createUser } from '../../src/api/users';
import type { Role } from '../../src/types';

type UserForm = {
  nickname: string;
  email: string;
  password: string;
  role: Role;
  totalPoints: string;
  levelTitle: string;
};

/**
 * Crear usuario (admin). Formulario con validación y confirmación al guardar.
 * La contraseña solo viaja al crear: nunca vuelve del servidor.
 */
export default function NewUser() {
  const { control, handleSubmit, setError, formState } = useForm<UserForm>({
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
      role: 'USER',
      totalPoints: '0',
      levelTitle: 'Aprendiz',
    },
  });

  const submit = async (values: UserForm) => {
    try {
      await createUser({
        nickname: values.nickname.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        role: values.role,
        totalPoints: Number(values.totalPoints),
        levelTitle: values.levelTitle.trim(),
      });
      Alert.alert('Usuario creado', `${values.nickname} quedó registrado.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (failure) {
      // El mensaje del servidor (ej. correo duplicado) se muestra en pantalla.
      setError('root', { message: (failure as Error).message });
    }
  };

  return (
    <Pressable className="flex-1 bg-base" onPress={Keyboard.dismiss}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 p-6"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
        <View className="gap-1">
          <Text className="text-2xl font-bold text-white">Nuevo usuario</Text>
          <Text className="text-neutral-400">Crea perfiles de jugador o administrador.</Text>
        </View>

        <Field
          control={control}
          name="nickname"
          label="Apodo"
          placeholder="cazador_nocturno"
          rules={{
            required: 'El apodo es obligatorio',
            minLength: { value: 2, message: 'Mínimo 2 caracteres' },
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
            minLength: { value: 8, message: 'Mínimo 8 caracteres' },
            maxLength: { value: 72, message: 'Máximo 72 caracteres' },
          }}
        />

        <Controller
          control={control}
          name="role"
          render={({ field: { value, onChange } }) => (
            <RoleSegment value={value} onChange={onChange} />
          )}
        />

        <Field
          control={control}
          name="totalPoints"
          label="Puntos totales"
          keyboardType="numeric"
          placeholder="0"
          rules={{
            required: 'Los puntos son obligatorios',
            validate: (value) => {
              const n = Number(value);
              if (!Number.isInteger(n) || n < 0) return 'Debe ser un entero mayor o igual a 0';
              if (n > 999999) return 'Máximo 999999';
              return true;
            },
          }}
        />
        <Field
          control={control}
          name="levelTitle"
          label="Título de nivel"
          placeholder="Explorador Urbano"
          rules={{
            required: 'El título es obligatorio',
            maxLength: { value: 60, message: 'Máximo 60 caracteres' },
          }}
        />

        <FormError message={formState.errors.root?.message} />

        <Button
          text={formState.isSubmitting ? 'Guardando…' : 'Guardar usuario'}
          onPress={handleSubmit(submit)}
          disabled={formState.isSubmitting}
        />
      </ScrollView>
    </Pressable>
  );
}
