import { Controller, type Control } from 'react-hook-form';
import { DATE_RE } from '../utils/format';
import Field from './Field';
import { FormSection } from './Screen';
import Segmented from './Segmented';

/** Valores del formulario de eventos: fechas como texto AAAA-MM-DD. */
export interface EventFormValues {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export const EVENT_DEFAULTS: EventFormValues = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  isActive: true,
};

const STATUS = [
  { label: 'Activo', value: true },
  { label: 'Inactivo', value: false },
] as const;

/** Campos del evento, compartidos por crear y editar. */
export default function EventForm({
  control,
  getStartDate,
}: {
  control: Control<EventFormValues>;
  getStartDate: () => string;
}) {
  return (
    <>
      <FormSection title="Datos del evento">
        <Field
          control={control}
          name="name"
          label="Nombre"
          placeholder="Festival Centro 2026"
          rules={{
            required: 'El nombre es obligatorio',
            maxLength: { value: 80, message: 'Máximo 80 caracteres' },
          }}
        />
        <Field
          control={control}
          name="description"
          label="Descripción"
          placeholder="Rally de escaneos por el centro histórico"
          multiline
          numberOfLines={3}
          rules={{
            required: 'La descripción es obligatoria',
            maxLength: { value: 500, message: 'Máximo 500 caracteres' },
          }}
        />
      </FormSection>

      <FormSection title="Fechas" description="Formato AAAA-MM-DD. Los guiones se ponen solos.">
        <Field
          control={control}
          name="startDate"
          label="Inicio"
          placeholder="2026-09-20"
          keyboardType="number-pad"
          format="date"
          rules={{
            required: 'La fecha de inicio es obligatoria',
            pattern: { value: DATE_RE, message: 'Usa el formato AAAA-MM-DD' },
          }}
        />
        <Field
          control={control}
          name="endDate"
          label="Fin"
          placeholder="2026-09-22"
          keyboardType="number-pad"
          format="date"
          rules={{
            required: 'La fecha de fin es obligatoria',
            pattern: { value: DATE_RE, message: 'Usa el formato AAAA-MM-DD' },
            validate: (value) =>
              value >= getStartDate() || 'La fecha de fin no puede ser anterior al inicio',
          }}
        />
      </FormSection>

      <FormSection title="Estado" description="Un evento inactivo queda pausado para los jugadores.">
        <Controller
          control={control}
          name="isActive"
          render={({ field: { value, onChange } }) => (
            <Segmented options={STATUS} value={value} onChange={onChange} />
          )}
        />
      </FormSection>
    </>
  );
}
