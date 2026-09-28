import { Controller, type Control } from 'react-hook-form';
import type { AdminEvent } from '../types';
import {
  TAG_RULES,
  validateLatitude,
  validateLongitude,
  validatePointsReward,
  type TagFormValues,
} from '../utils/tagForm';
import EventSelect from './EventSelect';
import Field from './Field';
import { FormSection } from './Screen';
import Segmented from './Segmented';

const VISIBILITY = [
  { label: 'Visible', value: false },
  { label: 'Oculto', value: true },
] as const;

/**
 * Formulario del tag NFC, compartido por crear y editar. Va en el orden en que
 * se piensa un tag: qué es, dónde está, quién lo ve, qué entrega y a qué
 * evento pertenece.
 */
export default function TagForm({
  control,
  events,
}: {
  control: Control<TagFormValues>;
  events: AdminEvent[];
}) {
  return (
    <>
      <FormSection title="Identificación">
        <Field
          control={control}
          name="code"
          label="Código"
          hint="El que va grabado en la etiqueta física."
          autoCapitalize="characters"
          placeholder="TAG-PLAZA-001"
          rules={TAG_RULES.code}
        />
        <Field
          control={control}
          name="name"
          label="Nombre"
          placeholder="Fuente central"
          rules={TAG_RULES.name}
        />
        <Field
          control={control}
          name="description"
          label="Descripción (opcional)"
          placeholder="Tag junto a la fuente principal"
          multiline
          numberOfLines={3}
          rules={TAG_RULES.description}
        />
      </FormSection>

      <FormSection
        title="Ubicación"
        description="Dónde está pegada la etiqueta.">
        <Field
          control={control}
          name="latitude"
          label="Latitud"
          keyboardType="numbers-and-punctuation"
          placeholder="4.7110"
          rules={{ required: 'La latitud es obligatoria', validate: validateLatitude }}
        />
        <Field
          control={control}
          name="longitude"
          label="Longitud"
          keyboardType="numbers-and-punctuation"
          placeholder="-74.0721"
          rules={{ required: 'La longitud es obligatoria', validate: validateLongitude }}
        />
      </FormSection>

      <FormSection
        title="Visibilidad"
        description="Un tag oculto no muestra su ubicación: el jugador solo recibe la pista.">
        <Controller
          control={control}
          name="isHidden"
          render={({ field: { value, onChange } }) => (
            <Segmented options={VISIBILITY} value={value} onChange={onChange} />
          )}
        />
        <Field
          control={control}
          name="clueText"
          label="Pista (opcional)"
          placeholder="Busca donde canta el agua"
          multiline
          numberOfLines={2}
          rules={TAG_RULES.clueText}
        />
      </FormSection>

      <FormSection title="Recompensa" description="Lo que gana el jugador al escanearlo.">
        <Field
          control={control}
          name="pointsReward"
          label="Puntos"
          keyboardType="numeric"
          placeholder="10"
          rules={{ required: 'Los puntos son obligatorios', validate: validatePointsReward }}
        />
        <Field
          control={control}
          name="cardTitle"
          label="Título de la carta (opcional)"
          placeholder="Guardián de la Fuente"
          rules={TAG_RULES.cardTitle}
        />
        <Field
          control={control}
          name="cardImageUrl"
          label="Imagen de la carta (opcional)"
          placeholder="https://…"
          keyboardType="url"
          rules={TAG_RULES.cardImageUrl}
        />
        <Field
          control={control}
          name="cardFunFact"
          label="Dato curioso (opcional)"
          placeholder="La fuente se encendió en 1998"
          multiline
          numberOfLines={2}
          rules={TAG_RULES.cardFunFact}
        />
      </FormSection>

      <FormSection title="Evento" description="Opcional. Agrupa el tag dentro de una temporada o festival.">
        <Controller
          control={control}
          name="eventId"
          render={({ field: { value, onChange } }) => (
            <EventSelect events={events} value={value} onChange={onChange} />
          )}
        />
      </FormSection>
    </>
  );
}
