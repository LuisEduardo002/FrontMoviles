import type { Ref } from 'react';
import { Text, View } from 'react-native';
import { assetUrl } from '../config/env';
import { colors, glow } from '../theme/tokens';
import type { MyProfile, MyScan } from '../types';
import Avatar from './Avatar';
import CollectibleCard from './CollectibleCard';

/**
 * La tarjeta de cazador: lo que se comparte en redes. Es una vista normal que
 * `captureRef` convierte en imagen, así que lo que se ve es lo que se publica.
 * `collapsable={false}` es obligatorio en Android para que se pueda capturar.
 */
export default function HunterCard({
  profile,
  scans,
  ref,
}: {
  profile: MyProfile;
  scans: MyScan[];
  ref?: Ref<View>;
}) {
  const latest = scans.slice(0, 3);

  return (
    <View
      ref={ref}
      collapsable={false}
      className="gap-3 rounded-md border-[1.5px] border-primary bg-canvas p-3"
      style={{ boxShadow: glow.primary }}>
      <Text
        className="font-data-black text-h2 text-primary"
        style={{ textShadowColor: colors.primary, textShadowRadius: 12 }}>
        NFHunter
      </Text>

      <View className="flex-row items-center gap-3">
        <Avatar nickname={profile.nickname} url={profile.avatarUrl} size="md" highlight />
        <View className="flex-1 gap-1">
          <Text numberOfLines={1} className="font-data text-h3 text-ink">
            {profile.nickname}
          </Text>
          <Text className="font-body text-caption text-secondary">{profile.levelTitle ?? 'Cazador'}</Text>
        </View>
      </View>

      <View className="flex-row gap-2">
        <Figure value={profile.totalPoints} label="puntos" />
        <Figure value={profile.tagsFound} label="tags" />
        {profile.position != null && <Figure value={`#${profile.position}`} label="ranking" />}
      </View>

      {latest.length > 0 && (
        <View className="flex-row gap-2">
          {latest.map((scan) => (
            <CollectibleCard
              key={scan.id}
              title={scan.tag.cardTitle ?? scan.tag.name}
              imageUrl={assetUrl(scan.tag.cardImageUrl)}
              points={scan.pointsEarned}
            />
          ))}
        </View>
      )}

      <Text className="font-body text-caption text-ink/60">Cada esquina guarda una historia. Cada tag, un trofeo.</Text>
    </View>
  );
}

function Figure({ value, label }: { value: number | string; label: string }) {
  return (
    <View className="flex-1 items-center rounded-sm bg-surface p-2">
      <Text className="font-data-black text-h2 text-primary">{value}</Text>
      <Text className="font-body text-caption text-ink/70">{label}</Text>
    </View>
  );
}
