import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { router, Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';
import { HeaderAction } from '../../src/components/Screen';
import { tabScreenOptions } from '../../src/theme/navigation';

/**
 * Tabs del panel de administración. El Stack raíz (app/_layout.tsx) solo los
 * registra para ADMIN.
 *
 * El orden sigue el flujo del juego: primero se crea el evento, luego sus
 * tags, y los usuarios van después porque se gestionan menos. Cada lista
 * tiene su "Nuevo" en el header; crear y editar abren pantalla completa con
 * botón de retroceso (`app/<entidad>/...`).
 */
type IconName = ComponentProps<typeof MaterialDesignIcons>['name'];

const icon =
  (name: IconName) =>
  ({ color, size }: { color: ColorValue; size: number }) => (
    <MaterialDesignIcons name={name} color={color} size={size} />
  );

export default function TabsLayout() {
  return (
    <Tabs screenOptions={tabScreenOptions}>
      <Tabs.Screen name="index" options={{ title: 'Panel', tabBarIcon: icon('view-dashboard') }} />
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
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: icon('account-circle') }} />
    </Tabs>
  );
}
