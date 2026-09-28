import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { listEvents } from '../../src/api/events';
import { deleteTag, getTag, updateTag } from '../../src/api/tags';
import Button from '../../src/components/Button';
import Notice from '../../src/components/Notice';
import { DangerZone, ErrorScreen, FormScreen, LoadingScreen } from '../../src/components/Screen';
import TagForm from '../../src/components/TagForm';
import type { AdminEvent, NfcTag } from '../../src/types';
import { confirmDestructive } from '../../src/utils/dialog';
import { hapticError, hapticSuccess } from '../../src/utils/haptics';
import { TAG_DEFAULTS, formToUpdateTag, tagToForm, type TagFormValues } from '../../src/utils/tagForm';

/** Detalle + edición + eliminación. Al guardar solo envía lo que cambió. */
export default function TagDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [original, setOriginal] = useState<NfcTag | null>(null);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDeleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);

  const { control, handleSubmit, setError, reset, formState } = useForm<TagFormValues>({
    defaultValues: TAG_DEFAULTS,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [tag, eventList] = await Promise.all([getTag(id), listEvents().catch(() => [])]);
        setEvents(eventList);
        setOriginal(tag);
        reset(tagToForm(tag));
      } catch (failure) {
        setLoadError((failure as Error).message);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id, reset]);

  const submit = async (values: TagFormValues) => {
    if (!original) return;
    try {
      // El PATCH de tags no devuelve el tag, así que se vuelve a pedir.
      await updateTag(original.id, formToUpdateTag(values, formState.dirtyFields));
      const updated = await getTag(original.id);
      setOriginal(updated);
      reset(tagToForm(updated));
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
      'Eliminar tag',
      `¿Eliminar el tag ${original.code}? Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;
    try {
      setDeleting(true);
      await deleteTag(original.id);
      hapticSuccess();
      router.back();
    } catch (failure) {
      setDeleting(false);
      hapticError();
      setError('root', { message: (failure as Error).message });
    }
  };

  if (isLoading) return <LoadingScreen />;
  if (loadError || !original) return <ErrorScreen message={loadError ?? 'Tag no encontrado.'} />;

  const busy = formState.isSubmitting || isDeleting;

  return (
    <FormScreen>
      <Stack.Screen options={{ title: original.code }} />
      <TagForm control={control} events={events} />

      <Notice message={formState.errors.root?.message} />
      {saved && !formState.isDirty && <Notice tone="success" message="Cambios guardados." />}
      <Button
        text={formState.isSubmitting ? 'Guardando…' : 'Guardar cambios'}
        onPress={handleSubmit(submit, hapticError)}
        disabled={!formState.isDirty || busy}
      />

      <DangerZone
        description="Al eliminar el tag también se borran sus escaneos."
        buttonText={isDeleting ? 'Eliminando…' : 'Eliminar tag'}
        onPress={() => void remove()}
        disabled={busy}
      />
    </FormScreen>
  );
}
