import { ScrollView } from 'react-native';
import RankingRow from '@/components/player/RankingRow';
import ListScreen from '@/components/ui/ListScreen';
import { EmptyState, LoadingScreen } from '@/components/ui/Screen';
import { Chip } from '@/components/ui/Segmented';
import { useRanking } from '@/hooks/useRanking';

/**
 * Ranking de cazadores, general o por evento en curso. Si no estás en el
 * top, tu puesto sale arriba. La carga vive en `useRanking`.
 */
export default function Ranking() {
  const ranking = useRanking();

  if (ranking.isLoading) return <LoadingScreen />;

  return (
    <ListScreen
      items={ranking.top}
      total={ranking.top.length}
      noun={['cazador', 'cazadores']}
      error={ranking.error}
      isRefreshing={ranking.isRefreshing}
      onRefresh={ranking.refresh}
      controls={
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
            <Chip label="General" selected={!ranking.eventId} onPress={() => ranking.setEventId(undefined)} />
            {ranking.liveEvents.map((event) => (
              <Chip
                key={event.id}
                label={event.name}
                selected={ranking.eventId === event.id}
                onPress={() => ranking.setEventId(event.id)}
              />
            ))}
          </ScrollView>
          {ranking.meOutsideTop && <RankingRow entry={ranking.meOutsideTop} isMe />}
        </>
      }
      renderItem={(entry) => <RankingRow entry={entry} isMe={ranking.isMe(entry.id)} />}
      empty={
        <EmptyState
          icon="trophy-outline"
          title="Nadie ha puntuado aún"
          message={
            ranking.eventId
              ? 'Sé el primero en encontrar un tag de este evento.'
              : 'Escanea un tag para entrar al ranking.'
          }
        />
      }
    />
  );
}
