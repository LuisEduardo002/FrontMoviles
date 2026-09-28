import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ApiRequestError } from '../../src/api/client';
import { deleteUser, getUser, updateUser } from '../../src/api/users';
import Button from '../../src/components/Button';
import Field from '../../src/components/Field';
import Notice from '../../src/components/Notice';
import { DangerZone, ErrorScreen, FormScreen, FormSection, LoadingScreen } from '../../src/components/Screen';
import Segmented from '../../src/components/Segmented';
import { useSession } from '../../src/session/context';
import type { AdminUser, Role, UpdateUserDto } from '../../src/types';
import { confirmDestructive } from '../../src/utils/dialog';
import { hapticError, hapticSuccess } from '../../src/utils/haptics';

type UserForm = {
  nickname: string;
  email: string;
  password: string;
  role: Role;
  totalPoints: string;
  levelTitle: string;
};

const ROLE_OPTIONS = [
  { label: 'Jugador', value: 'USER' },
  { label: 'Administrador', value: 'ADMIN' },
] as const;

const toForm = (user: AdminUser): UserForm => ({
  nickname: user.nickname,
  email: user.email,
  password: '',
  role: user.role,
  totalPoints: String(user.totalPoints),
  levelTitle: user.levelTitle ?? '',
});

/**
 * Detalle + edición + eliminación de un usuario.
 * - Los datos llegan precargados (`reset` al cargar).
 * - Al guardar SOLO se envía lo que cambió (dirtyFields -> PATCH parcial).
 * - Eliminar pide confirmación explícita antes de borrar.
 */
export default function UserDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user: me } = useSession();
  const [original, setOriginal] = useState<AdminUser | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDeleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);

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
        const user = await getUser(id);
        setOriginal(user);
        reset(toForm(user));
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
    const { dirtyFields } = formState;
    const patch: UpdateUserDto = {};
    if (dirtyFields.nickname) patch.nickname = values.nickname.trim();
    if (dirtyFields.email) patch.email = values.email.trim().toLowerCase();
    if (dirtyFields.password && values.password) patch.password = values.password;
    if (dirtyFields.role) patch.role = values.role;
    if (dirtyFields.totalPoints) patch.totalPoints = Number(values.totalPoints);
    if (dirtyFields.levelTitle) patch.levelTitle = values.levelTitle.trim();

    try {
      const updated = await updateUser(original.id, patch);
      setOriginal(updated);
      reset(toForm(updated));
      setSaved(true);
      hapticSuccess();
    } catch (failure) {
      hapticError();
      setError('root', { message: (failure as Error).message });
    }
  };

  const remove = async () => {
    if (!original) return;
    const confirmed = await confirmDestructive(
      'Eliminar usuario',
      `¿Eliminar a ${original.nickname}? Se borra también su historial. Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;
    try {
      setDeleting(true);
      await deleteUser(original.id);
      hapticSuccess();
      router.back();
    } catch (failure) {
      setDeleting(false);
      hapticError();
      if (failure instanceof ApiRequestError && failure.status === 404) {
        // Otro admin lo borró primero: la lista se refresca al volver.
        router.back();
        return;
      }
      setError('root', { message: (failure as Error).message });
    }
  };

  if (isLoading) return <LoadingScreen />;
  if (loadError || !original) return <ErrorScreen message={loadError ?? 'Usuario no encontrado.'} />;

  const busy = formState.isSubmitting || isDeleting;
  const isMe = original.id === me?.id;

  return (
    <FormScreen>
      <Stack.Screen options={{ title: original.nickname }} />

      <FormSection title="Cuenta">
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
          label="Nueva contraseña"
          hint="Déjala vacía para no cambiarla."
          secureTextEntry
          placeholder="••••••••"
          rules={{
            validate: (value) => !value || value.length >= 8 || 'Mínimo 8 caracteres',
            maxLength: { value: 72, message: 'Máximo 72 caracteres' },
          }}
        />
      </FormSection>

      <FormSection title="Rol y progreso">
        <Controller
          control={control}
          name="role"
          render={({ field: { value, onChange } }) => (
            <Segmented label="Rol" options={ROLE_OPTIONS} value={value} onChange={onChange} />
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
      </FormSection>

      <Notice message={formState.errors.root?.message} />
      {saved && !formState.isDirty && <Notice tone="success" message="Cambios guardados." />}
      <Button
        text={formState.isSubmitting ? 'Guardando…' : 'Guardar cambios'}
        onPress={handleSubmit(submit, hapticError)}
        disabled={!formState.isDirty || busy}
      />

      {!isMe && (
        <DangerZone
          description="Se borran la cuenta y todo su historial de escaneos."
          buttonText={isDeleting ? 'Eliminando…' : 'Eliminar usuario'}
          onPress={() => void remove()}
          disabled={busy}
        />
      )}
    </FormScreen>
  );
}
