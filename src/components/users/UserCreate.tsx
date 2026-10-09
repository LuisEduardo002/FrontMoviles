import { createUser } from '@/api/users';
import Button from '@/components/ui/Button';
import Notice from '@/components/ui/Notice';
import { FormScreen } from '@/components/ui/Screen';
import UserForm from '@/components/users/UserForm';
import { useCreateForm } from '@/hooks/useCreateForm';
import { USER_DEFAULTS, formToCreateUser, type UserFormValues } from '@/utils/userForm';

/** Pantalla de crear usuario. La lógica vive en `useCreateForm`. */
export default function UserCreate() {
  const { control, submit, error, isSubmitting } = useCreateForm<UserFormValues, ReturnType<typeof formToCreateUser>>({
    defaults: USER_DEFAULTS,
    toPayload: formToCreateUser,
    create: createUser,
  });

  return (
    <FormScreen>
      <UserForm control={control} mode="create" />
      <Notice message={error} />
      <Button text={isSubmitting ? 'Creando…' : 'Crear usuario'} onPress={submit} disabled={isSubmitting} />
    </FormScreen>
  );
}
