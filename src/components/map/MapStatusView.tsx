import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import type { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import type { LocationPermissionState } from '@/hooks/useUserLocation';
import { MapStatusToken } from '@/theme/Token';
import { colors } from '@/theme/tokens';
import { hapticTap } from '@/utils/haptics';

type IconName = ComponentProps<typeof MaterialDesignIcons>['name'];
type Tone = keyof typeof MapStatusToken.tone;

/**
 * Avisos flotantes del mapa: carga, error de tags, permiso de ubicación y
 * GPS. Nunca tapan el mapa completo: los tags se pueden seguir usando aunque
 * falte la ubicación.
 */
export default function MapStatusView({
  isLoading,
  error,
  onRetry,
  permission,
  canAskAgain,
  isLocating,
  locationError,
  onLocationPress,
  tagCount,
}: {
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  permission: LocationPermissionState;
  canAskAgain: boolean;
  isLocating: boolean;
  locationError: string | null;
  onLocationPress: () => void;
  /** Tags que sí se pudieron pintar (con coordenadas). */
  tagCount: number;
}) {
  const locationDenied = permission === 'denied';
  const locating = permission === 'granted' && isLocating && !locationError;

  return (
    <View className={MapStatusToken.container} pointerEvents="box-none">
      {!!error && (
        <Banner tone="error" icon="alert-circle-outline" message={error} action="Reintentar" onAction={onRetry} />
      )}
      {isLoading && <Banner tone="muted" loading message="Cargando tags…" />}
      {!isLoading && !error && tagCount === 0 && (
        <Banner
          tone="muted"
          icon="map-marker-off-outline"
          message="Aún no hay tags con ubicación."
          action="Reintentar"
          onAction={onRetry}
        />
      )}
      {locationDenied && (
        <Banner
          tone="info"
          icon="map-marker-off"
          message={
            canAskAgain
              ? 'Activa tu ubicación para verte en el mapa.'
              : 'La ubicación está bloqueada. Actívala en Ajustes.'
          }
          action={canAskAgain ? 'Activar' : 'Ajustes'}
          onAction={onLocationPress}
        />
      )}
      {!!locationError && (
        <Banner
          tone="info"
          icon="crosshairs-gps"
          message={locationError}
          action="Reintentar"
          onAction={onLocationPress}
        />
      )}
      {locating && <Banner tone="muted" loading message="Ubicándote…" />}
    </View>
  );
}

function Banner({
  tone,
  icon,
  message,
  action,
  onAction,
  loading,
}: {
  tone: Tone;
  icon?: IconName;
  message: string;
  action?: string;
  onAction?: () => void;
  loading?: boolean;
}) {
  return (
    <View
      className={`${MapStatusToken.banner} ${MapStatusToken.tone[tone]}`}
      accessibilityRole={tone === 'error' ? 'alert' : undefined}>
      {loading ? (
        <ActivityIndicator size="small" color={colors.secondary} />
      ) : (
        !!icon && (
          <MaterialDesignIcons
            name={icon}
            size={MapStatusToken.iconSize}
            color={tone === 'error' ? colors.danger : colors.secondary}
          />
        )
      )}
      <Text className={MapStatusToken.text}>{message}</Text>
      {!!action && !!onAction && (
        <Pressable
          onPress={() => {
            hapticTap();
            onAction();
          }}
          accessibilityRole="button"
          className={MapStatusToken.action}>
          <Text className={MapStatusToken.actionText}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}
