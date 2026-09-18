import { Pressable, Text, View } from 'react-native';
import type { AdminEvent } from '../types';

/**
 * Selector de evento opcional para el formulario de tags.
 * "Sin evento" limpia el vínculo; tocar un evento activo también lo suelta.
 * Si la lista llega vacía (backend sin eventos), solo muestra "Sin evento".
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
    <View className="gap-1.5">
      <Text className="font-semibold text-neutral-200">Evento (opcional)</Text>
      <View className="gap-2">
        <Pressable
          onPress={() => onChange('')}
          className={`rounded-xl p-3 active:opacity-80 ${
            !value ? 'bg-primary' : 'border border-secondary'
          }`}>
          <Text className={`font-semibold ${!value ? 'text-white' : 'text-neutral-100'}`}>
            Sin evento
          </Text>
        </Pressable>
        {events.map((event) => {
          const active = value === event.id;
          return (
            <Pressable
              key={event.id}
              onPress={() => onChange(active ? '' : event.id)}
              className={`rounded-xl p-3 active:opacity-80 ${
                active ? 'bg-primary' : 'border border-secondary'
              }`}>
              <Text className={`font-semibold ${active ? 'text-white' : 'text-neutral-100'}`}>
                {event.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
