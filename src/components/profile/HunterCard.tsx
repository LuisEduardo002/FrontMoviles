import type { Ref } from 'react';
import { Text, View } from 'react-native';
import { assetUrl } from '@/config/env';
import { HunterCardToken } from '@/theme/Token';
import { colors, glow } from '@/theme/tokens';
import type { MyProfile, MyScan } from '@/types';
import Avatar from '@/components/ui/Avatar';
import CollectibleCard from '@/components/player/CollectibleCard';

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
      className={HunterCardToken.container}
      style={{ boxShadow: glow.primary }}>
      <Text
        className={HunterCardToken.brand}
        style={{ textShadowColor: colors.primary, textShadowRadius: HunterCardToken.brandGlowRadius }}>
        NFHunter
      </Text>

      <View className={HunterCardToken.identity}>
        <Avatar nickname={profile.nickname} url={profile.avatarUrl} size="md" highlight />
        <View className={HunterCardToken.identityText}>
          <Text numberOfLines={1} className={HunterCardToken.nickname}>
            {profile.nickname}
          </Text>
          <Text className={HunterCardToken.level}>{profile.levelTitle ?? 'Cazador'}</Text>
        </View>
      </View>

      <View className={HunterCardToken.row}>
        <Figure value={profile.totalPoints} label="puntos" />
        <Figure value={profile.tagsFound} label="tags" />
        {profile.position != null && <Figure value={`#${profile.position}`} label="ranking" />}
      </View>

      {latest.length > 0 && (
        <View className={HunterCardToken.row}>
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

      <Text className={HunterCardToken.slogan}>Cada esquina guarda una historia. Cada tag, un trofeo.</Text>
    </View>
  );
}

function Figure({ value, label }: { value: number | string; label: string }) {
  return (
    <View className={HunterCardToken.figure}>
      <Text className={HunterCardToken.figureValue}>{value}</Text>
      <Text className={HunterCardToken.figureLabel}>{label}</Text>
    </View>
  );
}
