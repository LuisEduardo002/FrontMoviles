import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';

/**
 * Tabs del panel de administración NFHunter.
 * El Stack raíz (app/_layout.tsx) protege todo el grupo `(tabs)` con
 * `Stack.Protected guard={!!user}`: sin sesión ni siquiera están registradas.
 *
 * Cada tab es la LISTA de una entidad (con búsqueda); el crear y el
 * detalle/editar viven fuera de los tabs (`app/users/...`) para que ocupen
 * toda la pantalla con botón de retroceso.
 *
 * Estilo sleek dark mode NFHunter:
 * fondo #1c0a1c, bordes #391338, acento #722770.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#1c0a1c' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
        tabBarStyle: { backgroundColor: '#1c0a1c', borderTopColor: '#391338' },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#a1a1aa',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Panel',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Usuarios',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-multiple" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Eventos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-month" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="scans"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="nfc-variant" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
