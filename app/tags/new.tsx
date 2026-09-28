import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { listEvents } from '../../src/api/events';
import { createTag } from '../../src/api/tags';
import Button from '../../src/components/Button';
import Notice from '../../src/components/Notice';
import { FormScreen } from '../../src/components/Screen';
import TagForm from '../../src/components/TagForm';
import type { AdminEvent } from '../../src/types';
import { hapticError, hapticSuccess } from '../../src/utils/haptics';
import { TAG_DEFAULTS, formToCreateTag, type TagFormValues } from '../../src/utils/tagForm';

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
