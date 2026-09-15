import { Pressable, Text, View } from 'react-native';
import type { Role } from '../types';

/**
 * Selector de rol USER / ADMIN para los formularios de usuario.
 * Dos botones lado a lado; el activo va en primario, el otro en borde.
 */
export default function RoleSegment({ value, onChange }: { value: Role; onChange: (role: Role) => void }) {
  const options: { label: string; role: Role }[] = [
    { label: 'USER', role: 'USER' },
    { label: 'ADMIN', role: 'ADMIN' },
  ];
  return (
    <View className="gap-1.5">
      <Text className="font-semibold text-neutral-200">Rol</Text>
      <View className="flex-row gap-2">
        {options.map((option) => {
          const active = value === option.role;
          return (
            <Pressable
              key={option.role}
              onPress={() => onChange(option.role)}
              className={`flex-1 items-center rounded-xl p-3.5 active:opacity-80 ${
                active ? 'bg-primary' : 'border border-secondary'
              }`}>
              <Text className={`font-semibold ${active ? 'text-white' : 'text-neutral-100'}`}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
