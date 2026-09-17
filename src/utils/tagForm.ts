/**
 * Lógica compartida del formulario de tags NFC.
 *
 * Existe para no duplicar entre `app/tags/new.tsx` y `app/tags/[id].tsx`:
 * valores iniciales, validaciones y conversión formulario <-> DTO.
 */

import type { CreateTagDto, NfcTag, UpdateTagDto } from '../types';

/** Valores del formulario. Todo texto salvo `isHidden` (los números viajan como string por el TextInput). */
export interface TagFormValues {
  code: string;
  name: string;
  description: string;
  pointsReward: string;
  location: string;
  isHidden: boolean;
  clueText: string;
  cardTitle: string;
  cardImageUrl: string;
  cardFunFact: string;
  eventId: string;
}

export const TAG_DEFAULTS: TagFormValues = {
  code: '',
  name: '',
  description: '',
  pointsReward: '10',
  location: '',
  isHidden: false,
  clueText: '',
  cardTitle: '',
  cardImageUrl: '',
  cardFunFact: '',
  eventId: '',
};

/** Reglas de validación centralizadas: si el backend cambia un límite, se cambia aquí. */
export const TAG_RULES = {
  code: { required: 'El código es obligatorio', maxLength: { value: 100, message: 'Máximo 100 caracteres' } },
  name: { required: 'El nombre es obligatorio', maxLength: { value: 100, message: 'Máximo 100 caracteres' } },
  description: { maxLength: { value: 500, message: 'Máximo 500 caracteres' } },
  location: { required: 'La ubicación es obligatoria', maxLength: { value: 120, message: 'Máximo 120 caracteres' } },
  clueText: { maxLength: { value: 300, message: 'Máximo 300 caracteres' } },
  cardTitle: { maxLength: { value: 100, message: 'Máximo 100 caracteres' } },
  cardImageUrl: { maxLength: { value: 300, message: 'Máximo 300 caracteres' } },
  cardFunFact: { maxLength: { value: 500, message: 'Máximo 500 caracteres' } },
} as const;

/** Validador de puntos: entero 1..1000 (mismo rango que el historial de escaneos). */
export function validatePointsReward(value: unknown): true | string {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) return 'Debe ser un entero mayor a 0';
  if (n > 1000) return 'Máximo 1000';
  return true;
}

/** Un tag del backend al formulario (los null se vuelven '' para los inputs). */
export function tagToForm(tag: NfcTag): TagFormValues {
  return {
    code: tag.code,
    name: tag.name,
    description: tag.description ?? '',
    pointsReward: String(tag.pointsReward),
    location: tag.location,
    isHidden: tag.isHidden,
    clueText: tag.clueText ?? '',
    cardTitle: tag.cardTitle ?? '',
    cardImageUrl: tag.cardImageUrl ?? '',
    cardFunFact: tag.cardFunFact ?? '',
    eventId: tag.eventId ?? '',
  };
}

/** Del formulario de crear al DTO: los opcionales vacíos se omiten. */
export function formToCreateTag(values: TagFormValues): CreateTagDto {
  return {
    code: values.code.trim().toUpperCase(),
    name: values.name.trim(),
    description: values.description.trim() || undefined,
    pointsReward: Number(values.pointsReward),
    location: values.location.trim(),
    isHidden: values.isHidden,
    clueText: values.clueText.trim() || undefined,
    cardTitle: values.cardTitle.trim() || undefined,
    cardImageUrl: values.cardImageUrl.trim() || undefined,
    cardFunFact: values.cardFunFact.trim() || undefined,
    eventId: values.eventId.trim() || undefined,
  };
}

type Dirty = Partial<Record<keyof TagFormValues, boolean>>;

/**
 * Del formulario de editar al PATCH: solo viaja lo que cambió
 * (`dirtyFields` de react-hook-form). Sin cambios devuelve `{}`.
 */
export function formToUpdateTag(values: TagFormValues, dirty: Dirty): UpdateTagDto {
  const patch: UpdateTagDto = {};
  if (dirty.code) patch.code = values.code.trim().toUpperCase();
  if (dirty.name) patch.name = values.name.trim();
  if (dirty.description) patch.description = values.description.trim();
  if (dirty.pointsReward) patch.pointsReward = Number(values.pointsReward);
  if (dirty.location) patch.location = values.location.trim();
  if (dirty.isHidden) patch.isHidden = values.isHidden;
  if (dirty.clueText) patch.clueText = values.clueText.trim();
  if (dirty.cardTitle) patch.cardTitle = values.cardTitle.trim();
  if (dirty.cardImageUrl) patch.cardImageUrl = values.cardImageUrl.trim();
  if (dirty.cardFunFact) patch.cardFunFact = values.cardFunFact.trim();
  if (dirty.eventId) patch.eventId = values.eventId.trim();
  return patch;
}
