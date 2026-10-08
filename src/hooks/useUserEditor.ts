import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ApiRequestError } from '@/api/client';
import { deleteUser, getUser, updateUser } from '@/api/users';
import { useSession } from '@/session/context';
import type { AdminUser } from '@/types';
import { confirmDestructive } from '@/utils/dialog';
import { hapticError, hapticSuccess } from '@/utils/haptics';
import { USER_DEFAULTS, formToUpdateUser, userToForm, type UserFormValues } from '@/utils/userForm';

/**
 * Detalle editable de un usuario: lo carga, guarda solo lo que cambió y lo
 * elimina tras confirmar. `isMe` evita que un admin se borre a sí mismo.
 */
export function useUserEditor(id: string) {
  const { user: me } = useSession();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDeleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const { control, handleSubmit, setError, reset, formState } = useForm<UserFormValues>({
    defaultValues: USER_DEFAULTS,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const loaded = await getUser(id);
        setUser(loaded);
        reset(userToForm(loaded));
      } catch (failure) {
        setLoadError((failure as Error).message);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id, reset]);

  const save = handleSubmit(async (values) => {
    if (!user) return;
    try {
      const updated = await updateUser(user.id, formToUpdateUser(values, formState.dirtyFields));
      setUser(updated);
      reset(userToForm(updated));
      setSaved(true);
      hapticSuccess();
    } catch (failure) {
      hapticError();
      setError('root', { message: (failure as Error).message });
    }
  }, hapticError);

  const remove = async () => {
    if (!user) return;
    const confirmed = await confirmDestructive(
      'Eliminar usuario',
      `¿Eliminar a ${user.nickname}? Se borra también su historial. Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;
    try {
      setDeleting(true);
      await deleteUser(user.id);
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

  return {
    user,
    isMe: !!user && user.id === me?.id,
    isLoading,
    loadError,
    control,
    save,
    remove,
    error: formState.errors.root?.message,
    isSubmitting: formState.isSubmitting,
    isDeleting,
    isDirty: formState.isDirty,
    saved: saved && !formState.isDirty,
  };
}
