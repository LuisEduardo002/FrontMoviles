import { TextInput, View } from 'react-native';

/**
 * Buscador de las listas del panel (usuarios, eventos, historial).
 * Es solo un TextInput con el estilo de `Field`, pero sin react-hook-form:
 * las listas filtran en memoria y no necesitan validación.
 */
export default function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
}) {
  return (
    <View>
      <TextInput
        className="rounded-xl border border-secondary bg-tertiary p-3.5 text-white"
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#a3a3a3"
        autoCapitalize="none"
        returnKeyType="search"
      />
    </View>
  );
}
