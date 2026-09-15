import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, Keyboard, Pressable, ScrollView, Text, View } from 'react-native';
import Button from '../../src/components/Button';
import Field from '../../src/components/Field';
import FormError from '../../src/components/FormError';
import RoleSegment from '../../src/components/RoleSegment';
import { deleteUser, getUser, updateUser } from '../../src/api/users';
import type { AdminUser, Role, UpdateUserDto } from '../../src/types';

type UserForm = {
  nickname: string;
  email: string;
  password: string;
  role: Role;
  totalPoints: string;
  levelTitle: string;
};

/**
 * Detalle + edición + eliminación de un usuario.
 * - Los datos llegan precargados (`reset` al cargar).
 * - Al guardar SOLO se envía lo que cambió (dirtyFields -> PATCH parcial).
 * - Eliminar pide confirmación explícita antes de borrar.
 */
export default function UserDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [original, setOriginal] = useState<AdminUser | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDeleting, setDeleting] = useState(false);

  const { control, handleSubmit, setError, reset, formState } = useForm<UserForm>({
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
      role: 'USER',
      totalPoints: '0',
      levelTitle: '',
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const user = await getUser(id);
        setOriginal(user);
        // Precarga: el formulario arranca con los datos actuales del servidor.
        reset({
          nickname: user.nickname,
          email: user.email,
          password: '',
          role: user.role,
          totalPoints: String(user.totalPoints),
          levelTitle: user.levelTitle,
        });
      } catch (failure) {
        setLoadError((failure as Error).message);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id, reset]);

  const submit = async (values: UserForm) => {
    if (!original) return;
    // Solo lo que cambió viaja al backend (PATCH parcial, no PUT completo).
    const patch: UpdateUserDto = {};
    if (formState.dirtyFields.nickname) patch.nickname = values.nickname.trim();
    if (formState.dirtyFields.email) patch.email = values.email.trim().toLowerCase();
    if (formState.dirtyFields.password && values.password) patch.password = values.password;
    if (formState.dirtyFields.role) patch.role = values.role;
    if (formState.dirtyFields.totalPoints) patch.totalPoints = Number(values.totalPoints);
    if (formState.dirtyFields.levelTitle) patch.levelTitle = values.levelTitle.trim();

    if (Object.keys(patch).length === 0) {
      Alert.alert('Sin cambios', 'No modificaste ningún campo.');
      return;
    }

    try {
      const updated = await updateUser(original.id, patch);
      setOriginal(updated);
      reset(
        {
          nickname: updated.nickname,
          email: updated.email,
          password: '',
          role: updated.role,
          totalPoints: String(updated.totalPoints),
          levelTitle: updated.levelTitle,
        },
        { keepErrors: false },
      );
      Alert.alert('Usuario actualizado', 'Los cambios quedaron guardados.');
    } catch (failure) {
      setError('root', { message: (failure as Error).message });
    }
  };

  const confirmDelete = () => {
    if (!original) return;
    Alert.alert(
      'Eliminar usuario',
      `¿Eliminar a ${original.nickname}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => void remove(),
        },
      ],
    );
  };

  const remove = async () => {
    if (!original) return;
    try {
      setDeleting(true);
      await deleteUser(original.id);
      Alert.alert('Usuario eliminado', '', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (failure) {
      setDeleting(false);
      setError('root', { message: (failure as Error).message });
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-base">
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  if (loadError || !original) {
    return (
      <View className="flex-1 justify-center gap-5 bg-base p-6">
        <Text className="text-center text-xl font-bold text-white">No se pudo cargar</Text>
        <FormError message={loadError ?? 'Usuario no encontrado.'} />
        <Button text="Volver" onPress={() => router.back()} secondary />
      </View>
    );
  }

  return (
    <Pressable className="flex-1 bg-base" onPress={Keyboard.dismiss}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 p-6"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
        <View className="gap-1">
          <Text className="text-2xl font-bold text-white">{original.nickname}</Text>
          <Text className="text-xs text-neutral-400">id {original.id}</Text>
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
          label="Nueva contraseña (vacío = no cambiar)"
          secureTextEntry
          placeholder="••••••••"
          rules={{
            validate: (value) =>
              !value || value.length >= 8 || 'Mínimo 8 caracteres',
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
          text={formState.isSubmitting ? 'Guardando…' : 'Guardar cambios'}
          onPress={handleSubmit(submit)}
          disabled={formState.isSubmitting || isDeleting}
        />
        <Button
          text={isDeleting ? 'Eliminando…' : 'Eliminar usuario'}
          onPress={confirmDelete}
          disabled={formState.isSubmitting || isDeleting}
          secondary
        />
      </ScrollView>
    </Pressable>
  );
}
