import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSession } from '../../src/session/context';

/**
 * Panel principal del administrador: accesos a los tres CRUD
 * (usuarios, eventos, historial de escaneos) + estado de la sesión.
 */
const SECTIONS = [
  {
    href: '/(tabs)/users',
    icon: 'account-multiple',
    title: 'Usuarios',
    description: 'Perfiles, roles, puntos y niveles.',
  },
  {
    href: '/(tabs)/events',
    icon: 'calendar-month',
    title: 'Eventos',
    description: 'Festivales, temporadas y rallies.',
  },
  {
    href: '/(tabs)/scans',
    icon: 'nfc-variant',
    title: 'Historial de escaneos',
    description: 'Quién escaneó qué tag, dónde y cuándo.',
  },
] as const;

export default function Panel() {
  const { user } = useSession();

  return (
    <View className="flex-1 gap-6 bg-base p-6">
      <View className="gap-1">
        <Text className="text-2xl font-bold text-white">Panel de administración</Text>
        <Text className="text-neutral-400">
          {user?.email ?? 'Admin'} · {user?.role ?? 'ADMIN'}
        </Text>
      </View>

      <View className="gap-4">
        {SECTIONS.map((section) => (
          <Pressable
            key={section.href}
            onPress={() => router.push(section.href)}
            className="flex-row items-center gap-4 rounded-2xl border border-secondary bg-tertiary p-5 active:opacity-80">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-primary">
              <MaterialCommunityIcons name={section.icon} size={24} color="#fff" />
            </View>
            <View className="flex-1 gap-0.5">
              <Text className="text-lg font-bold text-white">{section.title}</Text>
              <Text className="text-sm text-neutral-400">{section.description}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#a1a1aa" />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
