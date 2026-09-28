import * as Sharing from 'expo-sharing';
import { useRef, useState } from 'react';
import { Platform, RefreshControl, ScrollView, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { listEvents } from '../../api/events';
import { getMyProfile } from '../../api/profile';
import { listMyScans } from '../../api/scans';
import { listPlayerTags } from '../../api/tags';
import AvatarEditor from '../../components/AvatarEditor';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import CollectibleCard from '../../components/CollectibleCard';
import HunterCard from '../../components/HunterCard';
import Notice from '../../components/Notice';
import { EmptyState, ErrorScreen, LoadingScreen } from '../../components/Screen';
import StatTile from '../../components/StatTile';
import { Caption, Heading } from '../../components/Typography';
import { assetUrl } from '../../config/env';
import { useFocusLoad } from '../../hooks/useFocusLoad';
import { useSession } from '../../session/context';
import { colors } from '../../theme/tokens';
import type { AdminEvent, MyProfile, MyScan, PlayerTag } from '../../types';
import { eventPhase } from '../../utils/events';
import { hapticError, hapticSuccess } from '../../utils/haptics';

async function loadProfile() {
  const [profile, scans, tags, events] = await Promise.all([
    getMyProfile(),
    listMyScans(),
    listPlayerTags().catch(() => [] as PlayerTag[]),
    listEvents().catch(() => [] as AdminEvent[]),
  ]);
  // Las siluetas "???" son los tags que aún se pueden conseguir: sin evento o
  // de un evento en curso. Los de eventos terminados ya no se muestran.
  const live = new Set(events.filter((event) => eventPhase(event) === 'live').map((event) => event.id));
  const pending = tags.filter((tag) => !tag.foundByMe && (!tag.eventId || live.has(tag.eventId)));
  return { profile, scans, pending };
}

/**
 * Perfil del jugador: su foto, sus números, la tarjeta para presumir en redes
 * y el álbum con las cartas que tiene y las que le faltan.
 */
export default function PlayerProfile() {
  const { logout } = useSession();
  const { data, isLoading, isRefreshing, error, refresh } = useFocusLoad<{
    profile: MyProfile | null;
    scans: MyScan[];
    pending: PlayerTag[];
  }>(loadProfile, { profile: null, scans: [], pending: [] });
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [isSharing, setSharing] = useState(false);
  const cardRef = useRef<View>(null);

  if (isLoading) return <LoadingScreen />;
  if (!data.profile) return <ErrorScreen message={error ?? 'No se pudo cargar tu perfil.'} />;

  const profile = { ...data.profile, avatarUrl: newAvatar ?? data.profile.avatarUrl };

  const share = async () => {
    setShareError(null);
    // captureRef y el menú de compartir son del celular: en el navegador no existen
    if (Platform.OS === 'web' || !(await Sharing.isAvailableAsync())) {
      setShareError('Compartir funciona desde la app en el celular.');
      return;
    }
    try {
      setSharing(true);
      const uri = await captureRef(cardRef, { format: 'png', quality: 1 });
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Presume tu álbum' });
      hapticSuccess();
    } catch (failure) {
      hapticError();
      setShareError((failure as Error).message);
    } finally {
      setSharing(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerClassName="gap-4 p-3 pb-6"
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={colors.primary} />
      }>
      <View className="items-center gap-2">
        <AvatarEditor profile={profile} onChanged={setNewAvatar} />
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
        <HunterCard ref={cardRef} profile={profile} scans={data.scans} />
        <Notice message={shareError} />
        <Button
          text={isSharing ? 'Preparando…' : 'Presumir en redes'}
          icon="share-variant"
          onPress={() => void share()}
          disabled={isSharing}
        />
      </View>

      <View className="gap-3">
        <View className="flex-row items-baseline justify-between">
          <Heading level="h3">Mi álbum</Heading>
          <Caption>
            {data.scans.length} de {data.scans.length + data.pending.length}
          </Caption>
        </View>
        {data.scans.length + data.pending.length === 0 ? (
          <EmptyState
            icon="cards-outline"
            title="Tu álbum está vacío"
            message="Cuando haya un evento en curso, sal a buscar sus tags."
          />
        ) : (
          <View className="flex-row flex-wrap gap-3">
            {data.scans.map((scan) => (
              <View key={scan.id} className="w-[47%]">
                <CollectibleCard
                  title={scan.tag.cardTitle ?? scan.tag.name}
                  subtitle={scan.tag.name}
                  imageUrl={assetUrl(scan.tag.cardImageUrl)}
                  points={scan.pointsEarned}
                />
              </View>
            ))}
            {data.pending.map((tag) => (
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
