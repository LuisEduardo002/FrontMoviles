import { RefreshControl, ScrollView, View } from 'react-native';
import CollectibleCard from '@/components/player/CollectibleCard';
import AvatarEditor from '@/components/profile/AvatarEditor';
import HunterCard from '@/components/profile/HunterCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Notice from '@/components/ui/Notice';
import { EmptyState, ErrorScreen, LoadingScreen } from '@/components/ui/Screen';
import StatTile from '@/components/ui/StatTile';
import { Caption, Heading } from '@/components/ui/Typography';
import { assetUrl } from '@/config/env';
import { usePlayerProfile } from '@/hooks/usePlayerProfile';
import { useSession } from '@/session/context';
import { useShareImage } from '@/hooks/useShareImage';
import { colors } from '@/theme/tokens';

/**
 * Perfil del jugador: su foto, sus números, la tarjeta para presumir en redes
 * y el álbum con las cartas que tiene y las que le faltan.
 */
export default function PlayerProfile() {
  const { profile, scans, pending, albumSize, setAvatar, isLoading, isRefreshing, error, refresh } =
    usePlayerProfile();
  const { logout } = useSession();
  const shareCard = useShareImage('Presume tu álbum');

  if (isLoading) return <LoadingScreen />;
  if (!profile) return <ErrorScreen message={error ?? 'No se pudo cargar tu perfil.'} />;

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerClassName="gap-4 p-3 pb-6"
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={colors.primary} />
      }>
      <View className="items-center gap-2">
        <AvatarEditor profile={profile} onChanged={setAvatar} />
        <Heading level="h2" className="text-center">
          {profile.nickname}
        </Heading>
        <Badge text={profile.levelTitle ?? 'Cazador'} tone="secondary" />
      </View>

      <View className="flex-row gap-2">
        <StatTile value={profile.totalPoints} label="Puntos" highlight />
        <StatTile value={profile.tagsFound} label="Tags" />
        <StatTile value={profile.position != null ? `#${profile.position}` : '—'} label="Ranking" />
      </View>

      <View className="gap-3">
        <Heading level="h3">Tu tarjeta de cazador</Heading>
        <HunterCard ref={shareCard.ref} profile={profile} scans={scans} />
        <Notice message={shareCard.error} />
        <Button
          text={shareCard.isSharing ? 'Preparando…' : 'Presumir en redes'}
          icon="share-variant"
          onPress={() => void shareCard.share()}
          disabled={shareCard.isSharing}
        />
      </View>

      <View className="gap-3">
        <View className="flex-row items-baseline justify-between">
          <Heading level="h3">Mi álbum</Heading>
          <Caption>
            {scans.length} de {albumSize}
          </Caption>
        </View>
        {albumSize === 0 ? (
          <EmptyState
            icon="cards-outline"
            title="Tu álbum está vacío"
            message="Cuando haya un evento en curso, sal a buscar sus tags."
          />
        ) : (
          <View className="flex-row flex-wrap gap-3">
            {scans.map((scan) => (
              <View key={scan.id} className="w-[47%]">
                <CollectibleCard
                  title={scan.tag.cardTitle ?? scan.tag.name}
                  subtitle={scan.tag.name}
                  imageUrl={assetUrl(scan.tag.cardImageUrl)}
                  points={scan.pointsEarned}
                />
              </View>
            ))}
            {pending.map((tag) => (
              <View key={tag.id} className="w-[47%]">
                <CollectibleCard title={tag.name} points={tag.pointsReward} locked />
              </View>
            ))}
          </View>
        )}
      </View>

      <Button text="Cerrar sesión" icon="logout" variant="secondary" onPress={() => void logout()} />
    </ScrollView>
  );
}
