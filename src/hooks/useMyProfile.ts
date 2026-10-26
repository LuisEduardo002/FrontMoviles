import { useState } from 'react';
import { getMyProfile } from '@/api/profile';
import { useFocusLoad } from '@/hooks/useFocusLoad';
import type { MyProfile } from '@/types';

/**
 * El perfil de quien usa la app. `setAvatar` actualiza la foto en pantalla
 * en cuanto se sube, sin esperar a recargar el perfil.
 */
export function useMyProfile() {
  const { data, ...state } = useFocusLoad<MyProfile | null>(getMyProfile, null);
  const [newAvatar, setAvatar] = useState<string | null>(null);

  const profile = data && { ...data, avatarUrl: newAvatar ?? data.avatarUrl };
  return { profile, setAvatar, ...state };
}
