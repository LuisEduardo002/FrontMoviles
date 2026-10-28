/**
 * Lógica compartida del formulario de eventos (mismo papel que `tagForm.ts`):
 * valores iniciales y conversión formulario <-> DTO. Son funciones puras: no
 * tienen estado ni tocan la red, por eso viven aquí y no en un hook.
 */

import type { AdminEvent, CreateEventDto, UpdateEventDto } from '@/types';
import { toApiDate, toDateInputValue } from '@/utils/format';

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

/** Un evento del backend al formulario. */
export function eventToForm(event: AdminEvent): EventFormValues {
  return {
    name: event.name,
    description: event.description ?? '',
    startDate: toDateInputValue(event.startDate),
    endDate: toDateInputValue(event.endDate),
    isActive: event.isActive,
  };
}

/** Del formulario de crear al DTO: la descripción vacía se omite. */
export function formToCreateEvent(values: EventFormValues): CreateEventDto {
  return {
    name: values.name.trim(),
    description: values.description.trim() || undefined,
    startDate: toApiDate(values.startDate.trim()),
    endDate: toApiDate(values.endDate.trim()),
    isActive: values.isActive,
  };
}

type Dirty = Partial<Record<keyof EventFormValues, boolean>>;

/** Del formulario de editar al PATCH: solo viaja lo que cambió. */
export function formToUpdateEvent(values: EventFormValues, dirty: Dirty): UpdateEventDto {
  const patch: UpdateEventDto = {};
  if (dirty.name) patch.name = values.name.trim();
  if (dirty.description) patch.description = values.description.trim();
  if (dirty.startDate) patch.startDate = toApiDate(values.startDate.trim());
  if (dirty.endDate) patch.endDate = toApiDate(values.endDate.trim());
  if (dirty.isActive) patch.isActive = values.isActive;
  return patch;
}
