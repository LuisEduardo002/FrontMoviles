import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { listEvents } from '../../src/api/events';
import { getRanking } from '../../src/api/profile';
import Avatar from '../../src/components/Avatar';
import ListScreen from '../../src/components/ListScreen';
import { EmptyState, LoadingScreen } from '../../src/components/Screen';
import { Chip } from '../../src/components/Segmented';
import { Caption } from '../../src/components/Typography';
import { useFocusLoad } from '../../src/hooks/useFocusLoad';
import { useSession } from '../../src/session/context';
import { RankingToken } from '../../src/theme/Token';
import { glow } from '../../src/theme/tokens';
import type { AdminEvent, Ranking, RankingEntry } from '../../src/types';
import { eventPhase } from '../../src/utils/events';
import { plural } from '../../src/utils/format';

/**
 * Ranking de cazadores: general (puntos totales) o de un evento en curso
 * (puntos ganados en él). Si no estás en el top, tu puesto sale arriba.
 */
export default function RankingScreen() {
  const { user } = useSession();
  const [eventId, setEventId] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    const [ranking, events] = await Promise.all([
      getRanking(eventId),
      listEvents().catch(() => [] as AdminEvent[]),
    ]);
    return { ranking, events: events.filter((event) => eventPhase(event) === 'live') };
  }, [eventId]);
  const { data, isLoading, isRefreshing, error, refresh } = useFocusLoad<{
    ranking: Ranking;
    events: AdminEvent[];
  }>(load, { ranking: { top: [], me: null }, events: [] });

  if (isLoading) return <LoadingScreen />;

  const { top, me } = data.ranking;
  const meOutsideTop = me && !top.some((entry) => entry.id === me.id);

  return (
    <ListScreen
      items={top}
      total={top.length}
      noun={['cazador', 'cazadores']}
      error={error}
      isRefreshing={isRefreshing}
      onRefresh={refresh}
      controls={
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName={RankingToken.filters}>
            <Chip label="General" selected={!eventId} onPress={() => setEventId(undefined)} />
            {data.events.map((event) => (
              <Chip
                key={event.id}
                label={event.name}
                selected={eventId === event.id}
                onPress={() => setEventId(event.id)}
              />
            ))}
          </ScrollView>
          {meOutsideTop && <RankingRow entry={me} isMe />}
        </>
      }
      renderItem={(entry) => <RankingRow entry={entry} isMe={entry.id === user?.id} />}
      empty={
        <EmptyState
          icon="trophy-outline"
          title="Nadie ha puntuado aún"
          message={eventId ? 'Sé el primero en encontrar un tag de este evento.' : 'Escanea un tag para entrar al ranking.'}
        />
      }
    />
  );
}

function RankingRow({ entry, isMe }: { entry: RankingEntry; isMe: boolean }) {
  const podium = entry.position <= 3;

  return (
    <View
      className={`${RankingToken.row} ${isMe ? RankingToken.rowMe : ''}`}
      style={{ boxShadow: isMe ? glow.primary : glow.card }}>
      <Text
        className={`${RankingToken.position} ${RankingToken.positionSize[podium ? 'podium' : 'rest']} ${
          RankingToken.positionColor[entry.position === 1 ? 'first' : podium ? 'podium' : 'rest']
        }`}>
        {entry.position}
      </Text>
      <Avatar nickname={entry.nickname} url={entry.avatarUrl} highlight={entry.position === 1} />
      <View className={RankingToken.info}>
        <Text numberOfLines={1} className={RankingToken.nickname}>
          {entry.nickname}
          {isMe ? ' (tú)' : ''}
        </Text>
        <Caption numberOfLines={1}>
          {entry.levelTitle ?? 'Cazador'} · {plural(entry.tagsFound, 'tag', 'tags')}
        </Caption>
      </View>
      <Text className={RankingToken.points}>{entry.points}</Text>
    </View>
  );
}
