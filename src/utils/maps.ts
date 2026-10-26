import { Linking, Platform } from 'react-native';

/**
 * Abre la app de mapas del sistema apuntando al tag. Sin dependencias: en
 * iPhone abre Apple Maps; en Android y web, Google Maps.
 */
export function openInMaps(latitude: number, longitude: number, label: string) {
  const name = encodeURIComponent(label);
  const url =
    Platform.OS === 'ios'
      ? `https://maps.apple.com/?ll=${latitude},${longitude}&q=${name}`
      : `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  void Linking.openURL(url);
}
