import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';

/**
 * Tabs que solo existen después del login.
 * El Stack raíz (app/_layout.tsx) protege todo el grupo `(tabs)` con
 * `Stack.Protected guard={!!user}`: sin sesión ni siquiera están registradas.
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
          title: 'Agregar Tag',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="nfc" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="explorar"
        options={{
          title: 'Eventos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-month" color={color} size={size} />
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
