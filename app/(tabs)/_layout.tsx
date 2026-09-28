import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { router, Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';
import { HeaderAction } from '../../src/components/Screen';
import { useSession } from '../../src/session/context';
import { tabScreenOptions } from '../../src/theme/navigation';

/**
 * Tabs de la app. Cambian con el rol, con `Tabs.Protected` (igual que el
 * Stack raíz): un tab que no es del rol ni siquiera se registra.
 *
 * - ADMIN: Panel · Eventos · Tags · Usuarios · Chat · Perfil. El orden de las
 *   listas sigue el flujo del juego: primero el evento, luego sus tags.
 * - Jugador: Eventos · Escanear · Chat · Ranking · Perfil. "Escanear" va al
 *   lado de Eventos porque es lo que se hace con ellos.
 *
 * `index` y `perfil` son de los dos: cada uno pinta su versión según el rol.
 */
type IconName = ComponentProps<typeof MaterialDesignIcons>['name'];

const icon =
  (name: IconName) =>
  ({ color, size }: { color: ColorValue; size: number }) => (
    <MaterialDesignIcons name={name} color={color} size={size} />
  );

export default function TabsLayout() {
  const { user } = useSession();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <Tabs screenOptions={tabScreenOptions}>
      <Tabs.Screen
        name="index"
        options={
          isAdmin
            ? { title: 'Panel', tabBarIcon: icon('view-dashboard') }
            : { title: 'Eventos', tabBarIcon: icon('calendar-star') }
        }
      />

      <Tabs.Protected guard={isAdmin}>
        <Tabs.Screen
          name="events"
          options={{
            title: 'Eventos',
            tabBarIcon: icon('calendar-star'),
            headerRight: () => (
              <HeaderAction label="Nuevo evento" onPress={() => router.push('/events/new')} />
            ),
          }}
        />
        <Tabs.Screen
          name="tags"
          options={{
            title: 'Tags NFC',
            tabBarIcon: icon('nfc-variant'),
            headerRight: () => (
              <HeaderAction label="Nuevo tag" onPress={() => router.push('/tags/new')} />
            ),
          }}
        />
        <Tabs.Screen
          name="users"
          options={{
            title: 'Usuarios',
            tabBarIcon: icon('account-group'),
            headerRight: () => (
              <HeaderAction label="Nuevo usuario" onPress={() => router.push('/users/new')} />
            ),
          }}
        />
      </Tabs.Protected>

      <Tabs.Protected guard={!isAdmin}>
        <Tabs.Screen name="scan" options={{ title: 'Escanear', tabBarIcon: icon('qrcode-scan') }} />
      </Tabs.Protected>

      <Tabs.Screen name="chat" options={{ title: 'Chat', tabBarIcon: icon('forum') }} />

      <Tabs.Protected guard={!isAdmin}>
        <Tabs.Screen name="ranking" options={{ title: 'Ranking', tabBarIcon: icon('trophy') }} />
      </Tabs.Protected>

      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: icon('account-circle') }} />
    </Tabs>
  );
}
