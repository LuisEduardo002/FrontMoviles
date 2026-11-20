import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PlayerEventCard from '@/components/events/PlayerEventCard';
import ListScreen from '@/components/ui/ListScreen';
import { EmptyState, LoadingScreen } from '@/components/ui/Screen';
import SearchBar from '@/components/ui/SearchBar';
import Segmented from '@/components/ui/Segmented';
import { useListFilter } from '@/hooks/useListFilter';
import { usePlayerEvents } from '@/hooks/usePlayerEvents';
import { colors, glow } from '@/theme/tokens';
import type { EventPhase } from '@/utils/events';
import { EVENT_PHASE_FILTER } from '@/utils/listFilters';

const EMPTY: Record<EventPhase, { title: string; message: string }> = {
  live: { title: 'Nada en curso', message: 'Revisa los próximos eventos para saber cuándo empieza la cacería.' },
  upcoming: { title: 'Sin eventos próximos', message: 'Cuando se anuncie uno nuevo aparecerá aquí.' },
  ended: { title: 'Aún no ha terminado ninguno', message: 'Los eventos pasados se guardan aquí.' },
};

/**
 * Inicio del jugador: los eventos por momento (en curso, próximos,
 * finalizados), con su horario y cuántos tags lleva de cada uno.
 */
export default function PlayerEventList() {
  const insets = useSafeAreaInsets();
  const { events, progress, isLoading, isRefreshing, error, refresh } = usePlayerEvents();
  const {
    query,
    setQuery,
    filter: phase,
    setFilter: setPhase,
    filtered,
    totalInFilter: totalInPhase,
  } = useListFilter(events, EVENT_PHASE_FILTER);

  if (isLoading) return <LoadingScreen />;

  return (
    <View className="flex-1">
      <ListScreen
        items={filtered}
        total={totalInPhase}
        noun={['evento', 'eventos']}
        error={error}
        isRefreshing={isRefreshing}
        onRefresh={refresh}
        controls={
          <>
            <Segmented options={EVENT_PHASE_FILTER.options} value={phase} onChange={setPhase} />
            <SearchBar value={query} onChange={setQuery} placeholder="Buscar evento" />
          </>
        }
        renderItem={(event) => (
          <PlayerEventCard
            event={event}
            progress={progress.get(event.id)}
            onOpen={() => router.push({ pathname: '/events/[id]', params: { id: event.id } })}
          />
        )}
        empty={<EmptyState icon="calendar-search" {...EMPTY[phase]} />}
      />

      <Pressable
        onPress={() =>
          router.navigate({
            pathname: '/(tabs)/scan',
            params: { mode: 'camera', t: Date.now().toString() },
          })
        }
        className="absolute right-4 flex-row items-center gap-2 rounded-full bg-primary px-4 py-3 active:opacity-80"
        style={{
          bottom: Math.max(insets.bottom, 16) + 4,
          boxShadow: glow.primary,
        }}
        accessibilityRole="button"
        accessibilityLabel="Escanear un tag">
        <MaterialDesignIcons name="qrcode-scan" size={20} color={colors.inkInverted} />
        <Text className="font-body-bold text-button text-ink-inverted">Escanear</Text>
      </Pressable>
    </View>
  );
}
