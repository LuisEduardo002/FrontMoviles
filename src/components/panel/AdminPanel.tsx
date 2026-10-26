import { router } from 'expo-router';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Notice from '@/components/ui/Notice';
import { LoadingScreen } from '@/components/ui/Screen';
import StatTile from '@/components/ui/StatTile';
import { Caption, Heading } from '@/components/ui/Typography';
import { useAdminSummary } from '@/hooks/useAdminSummary';
import { useRole } from '@/hooks/useRole';
import { colors } from '@/theme/tokens';
import { formatDate, plural } from '@/utils/format';

/**
 * Inicio del administrador: cómo va la cacería de un vistazo y atajos a lo
 * que más se hace. Las cifras llevan a su lista.
 */
export default function AdminPanel() {
  const { user } = useRole();
  const summary = useAdminSummary();

  if (summary.isLoading) return <LoadingScreen />;

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerClassName="gap-4 p-3 pb-6"
      refreshControl={
        <RefreshControl refreshing={summary.isRefreshing} onRefresh={summary.refresh} tintColor={colors.primary} />
      }>
      <View className="gap-1">
        <Heading level="h2">Hola, cazador</Heading>
        <Caption>{user?.email}</Caption>
      </View>

      {summary.partialFailure && (
        <Notice message="Parte del resumen no se pudo cargar. Desliza hacia abajo para reintentar." />
      )}

      <View className="flex-row gap-2">
        <StatTile
          value={summary.activeEvents.length}
          label="Eventos activos"
          detail={`de ${summary.totalEvents} en total`}
          onPress={() => router.navigate('/(tabs)/events')}
          highlight
        />
        <StatTile
          value={summary.totalTags}
          label="Tags NFC"
          detail={plural(summary.hiddenTags, 'oculto', 'ocultos')}
          onPress={() => router.navigate('/(tabs)/tags')}
        />
        <StatTile
          value={summary.players}
          label="Jugadores"
          detail={plural(summary.admins, 'admin', 'admins')}
          onPress={() => router.navigate('/(tabs)/users')}
        />
      </View>

      <View className="gap-3">
        <Heading level="h3">Acciones rápidas</Heading>
        <Button text="Crear evento" icon="calendar-plus" onPress={() => router.push('/events/new')} />
        <Button text="Crear tag" icon="nfc-variant" variant="secondary" onPress={() => router.push('/tags/new')} />
        <Button
          text="Crear usuario"
          icon="account-plus"
          variant="secondary"
          onPress={() => router.push('/users/new')}
        />
      </View>

      <View className="gap-3">
        <Heading level="h3">Eventos activos</Heading>
        {summary.activeEvents.length === 0 ? (
          <Caption>No hay eventos activos. Crea uno para empezar la cacería.</Caption>
        ) : (
          summary.activeEvents.map((event) => (
            <Card key={event.id} onPress={() => router.push({ pathname: '/events/[id]', params: { id: event.id } })}>
              <Text className="font-body-semibold text-h3 text-ink">{event.name}</Text>
              <Caption>
                {formatDate(event.startDate)} → {formatDate(event.endDate)} ·{' '}
                {plural(summary.tagsInEvent(event.id), 'tag', 'tags')}
              </Caption>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
}
