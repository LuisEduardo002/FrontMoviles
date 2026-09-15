import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { AdminUser } from '../types';

/**
 * Selector de usuario para el formulario de escaneos.
 * Sin dependencias nativas: una tarjeta que despliega la lista de usuarios
 * y guarda el `userId`. El historial conecta User <-> NfcTag, así que elegir
 * un usuario válido es obligatorio (el mock lo verifica y el backend lo hará).
 */
export default function UserSelect({
  users,
  value,
  onChange,
  error,
}: {
  users: AdminUser[];
  value: string;
  onChange: (userId: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = users.find((u) => u.id === value);

  return (
    <View className="gap-1.5">
      <Text className="font-semibold text-neutral-200">Usuario que escaneó</Text>
      <Pressable
        onPress={() => setOpen((prev) => !prev)}
        className={`rounded-xl border bg-tertiary p-3.5 active:opacity-80 ${
          error ? 'border-red-500' : 'border-secondary'
        }`}>
        <Text className={selected ? 'text-white' : 'text-neutral-400'}>
          {selected ? `${selected.nickname} · ${selected.email}` : 'Toca para elegir un usuario'}
        </Text>
      </Pressable>

      {open && (
        <View className="gap-2 rounded-xl border border-secondary bg-tertiary p-3">
          {users.length === 0 && <Text className="text-sm text-neutral-400">No hay usuarios.</Text>}
          {users.map((user) => {
            const active = user.id === value;
            return (
              <Pressable
                key={user.id}
                onPress={() => {
                  onChange(user.id);
                  setOpen(false);
                }}
                className={`rounded-lg p-3 active:opacity-80 ${active ? 'bg-primary' : 'bg-base'}`}>
                <Text className="font-semibold text-white">{user.nickname}</Text>
                <Text className="text-xs text-neutral-400">{user.email}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {!!error && <Text className="text-xs text-red-400">{error}</Text>}
    </View>
  );
}
