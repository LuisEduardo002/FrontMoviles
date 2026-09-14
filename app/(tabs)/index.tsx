import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, Text, View } from 'react-native';

/**
 * Pantalla "Agregar Tag NFC": minimalista, invita a la acción.
 * Solo UI por ahora: los botones no escanean de verdad.
 */
export default function AgregarTag() {
  return (
    <View className="flex-1 items-center gap-8 bg-base px-6 py-10">
      <View className="items-center gap-2">
        <Text className="text-2xl font-bold text-white">Vincular nuevo Tag</Text>
        <Text className="text-center text-sm text-neutral-400">
          Vincula un tag físico a tu cuenta para empezar la cacería
        </Text>
      </View>

      {/* Ilustración central: teléfono acercándose a un tag NFC */}
      <View className="items-center justify-center">
        <View className="h-56 w-56 items-center justify-center rounded-full bg-secondary/20">
          <View className="h-44 w-44 items-center justify-center rounded-full border border-secondary bg-tertiary">
            <View className="flex-row items-center gap-3">
              <MaterialCommunityIcons name="cellphone" size={56} color="#fff" />
              <MaterialCommunityIcons name="nfc" size={40} color="#722770" />
            </View>
            <View className="mt-3 rounded-full bg-primary px-4 py-1">
              <Text className="text-xs font-bold tracking-widest text-white">NFC</Text>
            </View>
          </View>
        </View>
      </View>

      <Text className="text-center text-base text-neutral-200">
        Acerca el Tag NFC a tu dispositivo
      </Text>

      <View className="w-full gap-3">
        <Pressable
          onPress={() => {}}
          className="items-center rounded-2xl bg-primary p-4 active:opacity-80">
          <Text className="text-base font-semibold text-white">Escanear ahora</Text>
        </Pressable>

        <Pressable
          onPress={() => {}}
          className="items-center rounded-2xl border border-secondary p-4 active:opacity-80">
          <Text className="text-base font-semibold text-white">Ingresar código manual</Text>
        </Pressable>
      </View>
    </View>
  );
}
