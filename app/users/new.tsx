import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { createUser } from '../../src/api/users';
import Button from '../../src/components/Button';
import Field from '../../src/components/Field';
import Notice from '../../src/components/Notice';
import { FormScreen, FormSection } from '../../src/components/Screen';
import Segmented from '../../src/components/Segmented';
import type { Role } from '../../src/types';
import { hapticError, hapticSuccess } from '../../src/utils/haptics';

type UserForm = {
  nickname: string;
  email: string;
  password: string;
  role: Role;
  levelTitle: string;
};

const ROLE_OPTIONS = [
  { label: 'Jugador', value: 'USER' },
  { label: 'Administrador', value: 'ADMIN' },
] as const;

/**
 * Crear usuario (admin). La contraseña solo viaja al crear: nunca vuelve del
 * servidor. Al guardar vuelve a la lista, que ya lo muestra.
 */
export default function NewUser() {
  const { control, handleSubmit, setError, formState } = useForm<UserForm>({
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
      role: 'USER',
      levelTitle: 'Aprendiz',
    },
  });

  const submit = async (values: UserForm) => {
    try {
      await createUser({
        nickname: values.nickname.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        role: values.role,
        levelTitle: values.levelTitle.trim(),
      });
      hapticSuccess();
      router.back();
    } catch (failure) {
      hapticError();
      // El mensaje del servidor (ej. correo duplicado) se muestra en pantalla.
      setError('root', { message: (failure as Error).message });
    }
  };

  return (
    <FormScreen>
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
          label="Contraseña"
          hint="Mínimo 8 caracteres. Compártela con el usuario por un canal seguro."
          secureTextEntry
          placeholder="••••••••"
          rules={{
            required: 'La contraseña es obligatoria',
            minLength: { value: 8, message: 'Mínimo 8 caracteres' },
            maxLength: { value: 72, message: 'Máximo 72 caracteres' },
          }}
        />
      </FormSection>

      <FormSection title="Rol y nivel">
        <Controller
          control={control}
          name="role"
          render={({ field: { value, onChange } }) => (
            <Segmented label="Rol" options={ROLE_OPTIONS} value={value} onChange={onChange} />
          )}
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
      <Button
        text={formState.isSubmitting ? 'Creando…' : 'Crear usuario'}
        onPress={handleSubmit(submit, hapticError)}
        disabled={formState.isSubmitting}
      />
    </FormScreen>
  );
}
