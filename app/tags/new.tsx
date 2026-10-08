import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { listEvents } from '@/api/events';
import { createTag } from '@/api/tags';
import Button from '@/components/ui/Button';
import Notice from '@/components/ui/Notice';
import { FormScreen } from '@/components/ui/Screen';
import TagForm from '@/components/tags/TagForm';
import type { AdminEvent } from '@/types';
import { hapticError, hapticSuccess } from '@/utils/haptics';
import { TAG_DEFAULTS, formToCreateTag, type TagFormValues } from '@/utils/tagForm';

/** Crear tag NFC. Solo código, nombre y ubicación son obligatorios. */
export default function NewTag() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const { control, handleSubmit, setError, formState } = useForm<TagFormValues>({
    defaultValues: TAG_DEFAULTS,
  });

  useEffect(() => {
    // Sin eventos el formulario sigue sirviendo: el tag queda "Sin evento".
    listEvents().then(setEvents, () => setEvents([]));
  }, []);

  const submit = async (values: TagFormValues) => {
    try {
      await createTag(formToCreateTag(values));
      hapticSuccess();
      router.back();
    } catch (failure) {
      hapticError();
      setError('root', { message: (failure as Error).message });
    }
  };

  return (
    <FormScreen>
      <TagForm control={control} events={events} />
      <Notice message={formState.errors.root?.message} />
      <Button
        text={formState.isSubmitting ? 'Creando…' : 'Crear tag'}
        onPress={handleSubmit(submit, hapticError)}
        disabled={formState.isSubmitting}
      />
    </FormScreen>
  );
}
