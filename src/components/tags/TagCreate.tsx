import TagForm from '@/components/tags/TagForm';
import Button from '@/components/ui/Button';
import Notice from '@/components/ui/Notice';
import { FormScreen } from '@/components/ui/Screen';
import { useCreateTag } from '@/hooks/useCreateTag';

/** Pantalla de crear tag. La lógica vive en `useCreateTag`. */
export default function TagCreate() {
  const { control, events, submit, error, isSubmitting } = useCreateTag();

  return (
    <FormScreen>
      <TagForm control={control} events={events} />
      <Notice message={error} />
      <Button text={isSubmitting ? 'Creando…' : 'Crear tag'} onPress={submit} disabled={isSubmitting} />
    </FormScreen>
  );
}
