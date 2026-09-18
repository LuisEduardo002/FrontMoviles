import { Pressable, Text, View } from 'react-native';

/**
 * Selector Visible / Oculto para el formulario de tags.
 * Mismo patrón visual que `RoleSegment`: dos botones, el activo en primario.
 */
export default function VisibilitySegment({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (hidden: boolean) => void;
}) {
  const options = [
    { label: 'Visible', hidden: false },
    { label: 'Oculto', hidden: true },
  ];
  return (
    <View className="gap-1.5">
      <Text className="font-semibold text-neutral-200">Visibilidad</Text>
      <View className="flex-row gap-2">
        {options.map((option) => {
          const active = value === option.hidden;
          return (
            <Pressable
              key={option.label}
              onPress={() => onChange(option.hidden)}
              className={`flex-1 items-center rounded-xl p-3 active:opacity-80 ${
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
