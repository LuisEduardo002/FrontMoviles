import type { Control } from 'react-hook-form';
import Field from './Field';
import { TAG_RULES, validatePointsReward, type TagFormValues } from '../utils/tagForm';

/**
 * Campos del tag NFC compartidos por crear y editar.
 * Los selects (`VisibilitySegment`, `EventSelect`) viven en las pantallas
 * porque necesitan `Controller`; aquí solo van los `Field` de texto.
 */
export default function TagFormFields({ control }: { control: Control<TagFormValues> }) {
  return (
    <>
      <Field
        control={control}
        name="code"
        label="Código"
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
      <Field
        control={control}
        name="pointsReward"
        label="Puntos que otorga"
        keyboardType="numeric"
        placeholder="10"
        rules={{ required: 'Los puntos son obligatorios', validate: validatePointsReward }}
      />
      <Field
        control={control}
        name="location"
        label="Ubicación (lat,lng)"
        placeholder="4.7110,-74.0721"
        rules={TAG_RULES.location}
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
      <Field
        control={control}
        name="cardTitle"
        label="Título de carta (opcional)"
        placeholder="Guardián de la Fuente"
        rules={TAG_RULES.cardTitle}
      />
      <Field
        control={control}
        name="cardImageUrl"
        label="Imagen de carta URL (opcional)"
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
    </>
  );
}
