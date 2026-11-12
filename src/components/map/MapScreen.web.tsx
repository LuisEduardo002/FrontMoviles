import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { View } from 'react-native';
import PlayerTagCard from '@/components/tags/PlayerTagCard';
import Button from '@/components/ui/Button';
import ListScreen from '@/components/ui/ListScreen';
import { EmptyState, LoadingScreen } from '@/components/ui/Screen';
import { Body, Heading } from '@/components/ui/Typography';
import { usePlayerTags } from '@/hooks/usePlayerTags';
import { MapScreenWebToken } from '@/theme/Token';
import { colors } from '@/theme/tokens';
import { plural } from '@/utils/format';

/**
 * Fallback de web: `react-native-maps` no existe en el navegador. En vez de
 * romper la pestaña, se listan los tags con ubicación y su enlace al mapa del
 * sistema. Metro elige este archivo en web y `MapScreen.tsx` en móvil.
 */
export default function MapScreen() {
  const { tags, isLoading, isRefreshing, error, refresh } = usePlayerTags();

  if (isLoading) return <LoadingScreen />;

  const located = tags.filter(
    (tag) => typeof tag.latitude === 'number' && typeof tag.longitude === 'number',
  );

  return (
    <ListScreen
      items={located}
      total={tags.length}
      noun={['tag', 'tags']}
      error={error}
      isRefreshing={isRefreshing}
      onRefresh={refresh}
      controls={
        <>
          <View className={MapScreenWebToken.banner}>
            <MaterialDesignIcons
              name="map-marker-off-outline"
              size={MapScreenWebToken.iconSize}
              color={colors.secondary}
            />
            <Heading level="h3" className={MapScreenWebToken.centered}>
              El mapa se ve en la app móvil
            </Heading>
            <Body muted className={MapScreenWebToken.centered}>
              En web no podemos dibujar el mapa, pero aquí tienes los tags con ubicación y cómo llegar.
            </Body>
          </View>
          {!!error && <Button text="Reintentar" variant="secondary" onPress={refresh} />}
        </>
      }
      renderItem={(tag) => <PlayerTagCard tag={tag} canHunt={!tag.foundByMe} />}
      empty={
        tags.length === 0 ? (
          <EmptyState
            icon="map-marker-off"
            title="Sin tags publicados"
            message="Todavía no hay tags para mostrar en el mapa."
          />
        ) : (
          <EmptyState
            icon="map-marker-off"
            title="Ningún tag tiene ubicación"
            message={`Hay ${plural(tags.length, 'tag', 'tags')}, pero ninguno tiene coordenadas en el mapa.`}
          />
        )
      }
    />
  );
}
