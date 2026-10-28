import { Text, View } from 'react-native';
import Avatar from '@/components/ui/Avatar';
import { Caption } from '@/components/ui/Typography';
import { RankingRowToken } from '@/theme/Token';
import { glow } from '@/theme/tokens';
import type { RankingEntry } from '@/types';
import { plural } from '@/utils/format';

/** Un puesto del ranking. El podio se ve más grande y el propio, resaltado. */
export default function RankingRow({ entry, isMe }: { entry: RankingEntry; isMe: boolean }) {
  const podium = entry.position <= 3;

  return (
    <View
      className={`${RankingRowToken.container} ${isMe ? RankingRowToken.me : ''}`}
      style={{ boxShadow: isMe ? glow.primary : glow.card }}>
      <Text
        className={`${RankingRowToken.position} ${RankingRowToken.positionSize[podium ? 'podium' : 'rest']} ${
          RankingRowToken.positionColor[entry.position === 1 ? 'first' : podium ? 'podium' : 'rest']
        }`}>
        {entry.position}
      </Text>
      <Avatar nickname={entry.nickname} url={entry.avatarUrl} highlight={entry.position === 1} />
      <View className={RankingRowToken.info}>
        <Text numberOfLines={1} className={RankingRowToken.nickname}>
          {entry.nickname}
          {isMe ? ' (tú)' : ''}
        </Text>
        <Caption numberOfLines={1}>
          {entry.levelTitle ?? 'Cazador'} · {plural(entry.tagsFound, 'tag', 'tags')}
        </Caption>
      </View>
      <Text className={RankingRowToken.points}>{entry.points}</Text>
    </View>
  );
}
