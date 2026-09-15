import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FlatList, Pressable, Text, View } from 'react-native';

interface Evento {
  id: string;
  titulo: string;
  fecha: string;
  lugar: string;
}

/** Datos de prueba: luego vendrán del backend. */
const EVENTOS: Evento[] = [
  { id: '1', titulo: 'Cacería nocturna centro', fecha: 'Sáb 20 · 8:00 PM', lugar: 'Plaza central' },
  { id: '2', titulo: 'Raid de tags del parque', fecha: 'Dom 21 · 10:00 AM', lugar: 'Parque norte' },
  { id: '3', titulo: 'Duelo de coleccionistas', fecha: 'Vie 26 · 6:00 PM', lugar: 'Arena NFHunter' },
  { id: '4', titulo: 'Expedición campus', fecha: 'Sáb 27 · 4:00 PM', lugar: 'Campus universitario' },
];

function EventoCard({ evento }: { evento: Evento }) {
  return (
    <View className="gap-3 rounded-2xl border border-secondary bg-tertiary p-5">
      <View className="gap-1">
        <Text className="text-lg font-bold text-white">{evento.titulo}</Text>
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-1 rounded-full bg-secondary px-3 py-1">
            <MaterialCommunityIcons name="clock-outline" size={14} color="#e5e5e5" />
            <Text className="text-xs font-semibold text-neutral-200">{evento.fecha}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-1">
          <MaterialCommunityIcons name="map-marker" size={14} color="#a1a1aa" />
          <Text className="text-sm text-neutral-400">{evento.lugar}</Text>
        </View>
      </View>

      <View className="flex-row gap-2">
        <Pressable
          onPress={() => {}}
          className="flex-1 items-center rounded-xl bg-primary p-3 active:opacity-80">
          <Text className="text-sm font-semibold text-white">Participar</Text>
        </Pressable>
        <Pressable
          onPress={() => {}}
          className="flex-1 items-center rounded-xl border border-secondary p-3 active:opacity-80">
          <Text className="text-sm font-semibold text-neutral-200">Ver detalles</Text>
        </Pressable>
      </View>
    </View>
  );
}

/** Pantalla "Eventos": feed limpio de tarjetas. */
export default function Eventos() {
  return (
    <View className="flex-1 bg-base px-6 pt-6">
      <View className="mb-4 gap-1">
        <Text className="text-2xl font-bold text-white">Próximos Eventos</Text>
        <Text className="text-sm text-neutral-400">
          {EVENTOS.length} eventos cerca de ti
        </Text>
      </View>

      <FlatList
        data={EVENTOS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventoCard evento={item} />}
        ItemSeparatorComponent={() => <View className="h-4" />}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
