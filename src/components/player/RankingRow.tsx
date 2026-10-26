import { Text, View } from 'react-native';
import Avatar from '@/components/ui/Avatar';
import { Caption } from '@/components/ui/Typography';
import { glow } from '@/theme/tokens';
import type { RankingEntry } from '@/types';
import { plural } from '@/utils/format';

/** Un puesto del ranking. El podio se ve más grande y el propio, resaltado. */
export default function RankingRow({ entry, isMe }: { entry: RankingEntry; isMe: boolean }) {
  const podium = entry.position <= 3;

  return (
    <View
      className={`flex-row items-center gap-3 rounded-md bg-surface p-3 ${isMe ? 'border-[1.5px] border-primary' : ''}`}
      style={{ boxShadow: isMe ? glow.primary : glow.card }}>
      <Text
        className={`w-[40px] text-center font-data-black ${podium ? 'text-h1' : 'text-h3'} ${
          entry.position === 1 ? 'text-primary' : podium ? 'text-secondary' : 'text-ink/60'
        }`}>
        {entry.position}
      </Text>
      <Avatar nickname={entry.nickname} url={entry.avatarUrl} highlight={entry.position === 1} />
      <View className="flex-1 gap-1">
        <Text numberOfLines={1} className="font-body-semibold text-h3 text-ink">
          {entry.nickname}
          {isMe ? ' (tú)' : ''}
        </Text>
        <Caption numberOfLines={1}>
          {entry.levelTitle ?? 'Cazador'} · {plural(entry.tagsFound, 'tag', 'tags')}
        </Caption>
      </View>
      <Text className="font-data text-h3 text-primary">{entry.points}</Text>
    </View>
  );
}
