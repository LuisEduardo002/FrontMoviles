import { Controller, type Control } from 'react-hook-form';
import Field from '@/components/ui/Field';
import { FormSection } from '@/components/ui/Screen';
import Segmented from '@/components/ui/Segmented';
import { ROLE_OPTIONS, validateTotalPoints, type UserFormValues } from '@/utils/userForm';

/**
 * Campos del usuario, compartidos por crear y editar. Cambian dos cosas:
 * al crear la contraseña es obligatoria; al editar es opcional y aparecen
 * los puntos.
 */
export default function UserForm({
  control,
  mode,
}: {
  control: Control<UserFormValues>;
  mode: 'create' | 'edit';
}) {
  const isEdit = mode === 'edit';

  return (
    <>
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
          label={isEdit ? 'Nueva contraseña' : 'Contraseña'}
          hint={
            isEdit
              ? 'Déjala vacía para no cambiarla.'
              : 'Mínimo 8 caracteres. Compártela con el usuario por un canal seguro.'
          }
          secureTextEntry
          placeholder="••••••••"
          rules={
            isEdit
              ? {
                  validate: (value) => !value || value.length >= 8 || 'Mínimo 8 caracteres',
                  maxLength: { value: 72, message: 'Máximo 72 caracteres' },
                }
              : {
                  required: 'La contraseña es obligatoria',
                  minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                  maxLength: { value: 72, message: 'Máximo 72 caracteres' },
                }
          }
        />
      </FormSection>

      <FormSection title={isEdit ? 'Rol y progreso' : 'Rol y nivel'}>
        <Controller
          control={control}
          name="role"
          render={({ field: { value, onChange } }) => (
            <Segmented label="Rol" options={ROLE_OPTIONS} value={value} onChange={onChange} />
          )}
        />
        {isEdit && (
          <Field
            control={control}
            name="totalPoints"
            label="Puntos totales"
            keyboardType="numeric"
            placeholder="0"
            rules={{ required: 'Los puntos son obligatorios', validate: validateTotalPoints }}
          />
        )}
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
    </>
  );
}
