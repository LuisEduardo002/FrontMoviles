import { router, type Href } from 'expo-router';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { listEvents } from '../../src/api/events';
import { listTags } from '../../src/api/tags';
import { listUsers } from '../../src/api/users';
import Button from '../../src/components/Button';
import Card from '../../src/components/Card';
import Notice from '../../src/components/Notice';
import { LoadingScreen } from '../../src/components/Screen';
import { Caption, Heading } from '../../src/components/Typography';
import { useFocusLoad } from '../../src/hooks/useFocusLoad';
import { useSession } from '../../src/session/context';
import { colors, glow } from '../../src/theme/tokens';
import type { AdminEvent, AdminUser, NfcTag } from '../../src/types';
import { formatDate } from '../../src/utils/format';

interface Summary {
  users: AdminUser[];
  events: AdminEvent[];
  tags: NfcTag[];
}

/** Si una de las tres listas falla, el resto del panel se sigue mostrando. */
async function loadSummary(): Promise<Summary & { failed: boolean }> {
  const [users, events, tags] = await Promise.allSettled([listUsers(), listEvents(), listTags()]);
  const value = <T,>(result: PromiseSettledResult<T[]>) =>
    result.status === 'fulfilled' ? result.value : [];
  return {
    users: value(users),
    events: value(events),
    tags: value(tags),
    failed: [users, events, tags].some((result) => result.status === 'rejected'),
  };
}

/**
 * Inicio del administrador: cómo va la cacería de un vistazo y atajos a lo
 * que más se hace. Las cifras llevan a su lista.
 */
export default function Panel() {
  const { user } = useSession();
  const { data, isLoading, isRefreshing, refresh } = useFocusLoad(loadSummary, {
    users: [],
    events: [],
    tags: [],
    failed: false,
  });

  if (isLoading) return <LoadingScreen />;

  const activeEvents = data.events.filter((event) => event.isActive);
  const hiddenTags = data.tags.filter((tag) => tag.isHidden).length;
  const players = data.users.filter((u) => u.role === 'USER').length;

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerClassName="gap-4 p-3 pb-6"
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={colors.primary} />
      }>
      <View className="gap-1">
        <Heading level="h2">Hola, cazador</Heading>
        <Caption>{user?.email}</Caption>
      </View>

      {data.failed && <Notice message="Parte del resumen no se pudo cargar. Desliza hacia abajo para reintentar." />}

      <View className="flex-row gap-2">
        <Stat
          value={activeEvents.length}
          label="Eventos activos"
          detail={`de ${data.events.length} en total`}
          href="/(tabs)/events"
          highlight
        />
        <Stat
          value={data.tags.length}
          label="Tags NFC"
          detail={plural(hiddenTags, 'oculto', 'ocultos')}
          href="/(tabs)/tags"
        />
        <Stat
          value={players}
          label="Jugadores"
          detail={plural(data.users.length - players, 'admin', 'admins')}
          href="/(tabs)/users"
        />
      </View>

      <View className="gap-3">
        <Heading level="h3">Acciones rápidas</Heading>
        <Button text="Crear evento" icon="calendar-plus" onPress={() => router.push('/events/new')} />
        <Button
          text="Crear tag"
          icon="nfc-variant"
          variant="secondary"
          onPress={() => router.push('/tags/new')}
        />
        <Button
          text="Crear usuario"
          icon="account-plus"
          variant="secondary"
          onPress={() => router.push('/users/new')}
        />
      </View>

      <View className="gap-3">
        <Heading level="h3">Eventos activos</Heading>
        {activeEvents.length === 0 ? (
          <Caption>No hay eventos activos. Crea uno para empezar la cacería.</Caption>
        ) : (
          activeEvents.map((event) => (
            <Card
              key={event.id}
              onPress={() => router.push({ pathname: '/events/[id]', params: { id: event.id } })}>
              <Text className="font-body-semibold text-h3 text-ink">{event.name}</Text>
              <Caption>
                {formatDate(event.startDate)} → {formatDate(event.endDate)} ·{' '}
                {plural(data.tags.filter((tag) => tag.eventId === event.id).length, 'tag', 'tags')}
              </Caption>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
}

function Stat({
  value,
  label,
  detail,
  href,
  highlight,
}: {
  value: number;
  label: string;
  detail: string;
  href: Href;
  highlight?: boolean;
}) {
  return (
    <Pressable
      onPress={() => router.navigate(href)}
      accessibilityRole="button"
      accessibilityLabel={`${value} ${label}, ${detail}`}
      className={`flex-1 gap-1 rounded-md bg-surface p-3 active:opacity-80 ${
        highlight ? 'border-[1.5px] border-primary' : ''
      }`}
      style={{ boxShadow: highlight ? glow.primary : glow.card }}>
      <Text className={`font-data-black text-display ${highlight ? 'text-primary' : 'text-ink'}`}>
        {value}
      </Text>
      <Text className={`font-body-semibold text-caption ${highlight ? 'text-primary' : 'text-ink'}`}>
        {label}
      </Text>
      <Caption>{detail}</Caption>
    </Pressable>
  );
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
