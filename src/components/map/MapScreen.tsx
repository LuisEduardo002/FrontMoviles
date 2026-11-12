import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import MapView, { type Region } from 'react-native-maps';
import MapStatusView from '@/components/map/MapStatusView';
import TagMarker from '@/components/map/TagMarker';
import PlayerTagCard from '@/components/tags/PlayerTagCard';
import { Caption } from '@/components/ui/Typography';
import { usePlayerTags } from '@/hooks/usePlayerTags';
import { useUserLocation } from '@/hooks/useUserLocation';
import { MapScreenToken } from '@/theme/Token';
import { colors } from '@/theme/tokens';
import type { PlayerTag } from '@/types';
import { plural } from '@/utils/format';
import { hapticTap } from '@/utils/haptics';

/** Punto de partida si todavía no hay GPS ni tags; la cámara se ajusta al llegar. */
const DEFAULT_REGION: Region = {
  latitude: 4.711,
  longitude: -74.0721,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

/** Cámara cómoda para el jugador, más cerrada que el fallback. */
const PLAYER_DELTA = { latitudeDelta: 0.02, longitudeDelta: 0.02 };

type LocatedTag = PlayerTag & { latitude: number; longitude: number };

function isLocated(tag: PlayerTag): tag is LocatedTag {
  return typeof tag.latitude === 'number' && typeof tag.longitude === 'number';
}

/**
 * Mapa de los tags públicos. El jugador ve su posición (si da permiso), los
 * tags con coordenadas y puede abrir la ficha de cada uno sin salir del mapa.
 *
 * Los tags ocultos llegan sin coordenadas a propósito (los filtra el backend),
 * así que no se pintan; abajo se avisa cuántos quedaron fuera.
 */
export default function MapScreen() {
  const { tags, isLoading, error, refresh } = usePlayerTags();
  const location = useUserLocation();
  const mapRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);
  const [selected, setSelected] = useState<PlayerTag | null>(null);
  const fitted = useRef(false);

  const located = useMemo(() => tags.filter(isLocated), [tags]);
  const withoutLocation = tags.length - located.length;

  const fitTags = useCallback(
    (animated: boolean) => {
      if (located.length === 0) return;
      if (located.length === 1) {
        const [tag] = located;
        mapRef.current?.animateToRegion(
          { latitude: tag.latitude, longitude: tag.longitude, ...PLAYER_DELTA },
          animated ? 400 : 0,
        );
        return;
      }
      mapRef.current?.fitToCoordinates(
        located.map((tag) => ({ latitude: tag.latitude, longitude: tag.longitude })),
        {
          edgePadding: { top: 96, right: 64, bottom: 200, left: 64 },
          animated,
        },
      );
    },
    [located],
  );

  // Primera cámara: los tags mandan. Si no hay ninguno, se centra en el GPS.
  useEffect(() => {
    if (!mapReady || fitted.current || located.length === 0) return;
    fitted.current = true;
    const frame = requestAnimationFrame(() => fitTags(false));
    return () => cancelAnimationFrame(frame);
  }, [mapReady, located.length, fitTags]);

  useEffect(() => {
    if (!mapReady || fitted.current || located.length > 0 || !location.position) return;
    mapRef.current?.animateToRegion({ ...location.position, ...PLAYER_DELTA }, 400);
  }, [mapReady, located.length, location.position]);

  const requestLocation = () => {
    if (location.permission === 'denied' && !location.canAskAgain) {
      void Linking.openSettings();
      return;
    }
    location.request();
  };

  const goToMe = () => {
    hapticTap();
    if (location.position) {
      mapRef.current?.animateToRegion({ ...location.position, ...PLAYER_DELTA }, 400);
      return;
    }
    requestLocation();
  };

  return (
    <View className={MapScreenToken.container}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={DEFAULT_REGION}
        showsUserLocation={location.permission === 'granted'}
        showsMyLocationButton={false}
        showsCompass
        moveOnMarkerPress={false}
        toolbarEnabled={false}
        loadingEnabled
        onMapReady={() => setMapReady(true)}
        onPress={() => setSelected(null)}>
        {located.map((tag) => (
          // `foundByMe` entra en la key: al cambiar el estado hay que volver a
          // rasterizar el pin, porque `tracksViewChanges` está apagado.
          <TagMarker
            key={`${tag.id}-${tag.foundByMe}`}
            tag={tag}
            onPress={(next) => {
              hapticTap();
              setSelected(next);
            }}
          />
        ))}
      </MapView>

      <MapStatusView
        isLoading={isLoading}
        error={error}
        onRetry={refresh}
        permission={location.permission}
        canAskAgain={location.canAskAgain}
        isLocating={location.isLocating}
        locationError={location.error}
        onLocationPress={requestLocation}
        tagCount={located.length}
      />

      {withoutLocation > 0 && !selected && (
        <View className={MapScreenToken.legend} pointerEvents="none">
          <Caption>{plural(withoutLocation, 'tag sin ubicación', 'tags sin ubicación')}</Caption>
        </View>
      )}

      {!selected && (
        <View className={MapScreenToken.fabStack}>
          {located.length > 0 && (
            <Fab
              icon="map-marker-multiple"
              label="Ver todos los tags"
              onPress={() => {
                hapticTap();
                fitTags(true);
              }}
            />
          )}
          <Fab icon="crosshairs-gps" label="Centrar en mi ubicación" onPress={goToMe} />
        </View>
      )}

      {!!selected && (
        <View className={MapScreenToken.sheet}>
          <Pressable
            onPress={() => {
              hapticTap();
              setSelected(null);
            }}
            accessibilityRole="button"
            accessibilityLabel="Cerrar la ficha del tag"
            className={MapScreenToken.sheetClose}>
            <MaterialDesignIcons name="close" size={MapScreenToken.sheetCloseIconSize} color={colors.ink} />
          </Pressable>
          <PlayerTagCard tag={selected} canHunt={!selected.foundByMe} />
        </View>
      )}
    </View>
  );
}

function Fab({
  icon,
  label,
  onPress,
}: {
  icon: 'map-marker-multiple' | 'crosshairs-gps';
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={MapScreenToken.fab}>
      <MaterialDesignIcons name={icon} size={MapScreenToken.fabIconSize} color={colors.secondary} />
    </Pressable>
  );
}
