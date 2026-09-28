import { View } from 'react-native';
import type { AdminEvent } from '../types';
import { Chip } from './Segmented';

/**
 * Selector de evento opcional para el formulario de tags.
 * "Sin evento" limpia el vínculo. Si no hay eventos, solo aparece esa opción.
 * Va dentro de la sección "Evento" de `TagForm`, que ya le pone título.
 */
export default function EventSelect({
  events,
  value,
  onChange,
}: {
  events: AdminEvent[];
  value: string;
  onChange: (eventId: string) => void;
}) {
  return (
    <View className="flex-row flex-wrap gap-2">
      <Chip label="Sin evento" selected={!value} onPress={() => onChange('')} />
      {events.map((event) => (
        <Chip
          key={event.id}
          label={event.isActive ? event.name : `${event.name} (inactivo)`}
          selected={value === event.id}
          onPress={() => onChange(event.id)}
        />
      ))}
    </View>
  );
}
