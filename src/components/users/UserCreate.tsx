import Button from '@/components/ui/Button';
import Notice from '@/components/ui/Notice';
import { FormScreen } from '@/components/ui/Screen';
import UserForm from '@/components/users/UserForm';
import { useCreateUser } from '@/hooks/useCreateUser';

/** Pantalla de crear usuario. La lógica vive en `useCreateUser`. */
export default function UserCreate() {
  const { control, submit, error, isSubmitting } = useCreateUser();

  return (
    <FormScreen>
      <UserForm control={control} mode="create" />
      <Notice message={error} />
      <Button text={isSubmitting ? 'Creando…' : 'Crear usuario'} onPress={submit} disabled={isSubmitting} />
    </FormScreen>
  );
}
