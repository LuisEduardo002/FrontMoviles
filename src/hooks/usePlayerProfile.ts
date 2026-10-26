import { useState } from 'react';
import { listEvents } from '@/api/events';
import { getMyProfile } from '@/api/profile';
import { listMyScans } from '@/api/scans';
import { listPlayerTags } from '@/api/tags';
import { useFocusLoad } from '@/hooks/useFocusLoad';
import type { AdminEvent, MyProfile, MyScan, PlayerTag } from '@/types';
import { eventPhase } from '@/utils/events';

async function loadPlayerProfile() {
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
 * El perfil del jugador con su álbum: las cartas que tiene (`scans`) y las
 * que aún le faltan (`pending`).
 */
export function usePlayerProfile() {
  const { data, ...state } = useFocusLoad<{ profile: MyProfile | null; scans: MyScan[]; pending: PlayerTag[] }>(
    loadPlayerProfile,
    { profile: null, scans: [], pending: [] },
  );
  const [newAvatar, setAvatar] = useState<string | null>(null);

  const profile = data.profile && { ...data.profile, avatarUrl: newAvatar ?? data.profile.avatarUrl };
  return {
    profile,
    scans: data.scans,
    pending: data.pending,
    albumSize: data.scans.length + data.pending.length,
    setAvatar,
    ...state,
  };
}
