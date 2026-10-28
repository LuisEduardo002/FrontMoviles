import { listEvents } from '@/api/events';
import { createTag } from '@/api/tags';
import TagForm from '@/components/tags/TagForm';
import Button from '@/components/ui/Button';
import Notice from '@/components/ui/Notice';
import { FormScreen } from '@/components/ui/Screen';
import { useCreateForm } from '@/hooks/useCreateForm';
import { useFocusLoad } from '@/hooks/useFocusLoad';
import { TAG_DEFAULTS, formToCreateTag, type TagFormValues } from '@/utils/tagForm';

/**
 * Pantalla de crear tag, con los eventos para elegir. Sin eventos el
 * formulario sigue sirviendo: el tag queda "Sin evento".
 */
export default function TagCreate() {
  const { data: events } = useFocusLoad(listEvents, []);
  const { control, submit, error, isSubmitting } = useCreateForm<TagFormValues, ReturnType<typeof formToCreateTag>>({
    defaults: TAG_DEFAULTS,
    toPayload: formToCreateTag,
    create: createTag,
  });

  return (
    <FormScreen>
      <TagForm control={control} events={events} />
      <Notice message={error} />
      <Button text={isSubmitting ? 'Creando…' : 'Crear tag'} onPress={submit} disabled={isSubmitting} />
    </FormScreen>
  );
}
