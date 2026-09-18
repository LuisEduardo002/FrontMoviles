/**
 * Campo de texto conectado a react-hook-form.
 *
 * `Controller` es el puente entre el formulario y un input de React Native:
 * le entrega el valor actual y recibe los cambios. Gracias a eso la pantalla
 * no necesita un `useState` por cada campo.
 */

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

// Hereda todas las props de TextInput (keyboardType, secureTextEntry...) y
// añade las del formulario.
type Props<T extends FieldValues> = TextInputProps & {
  control: Control<T>;
  /** Nombre del campo dentro del formulario. TypeScript solo acepta los que existen. */
  name: Path<T>;
  label: string;
  /** Reglas de validación: required, minLength, pattern, validate... */
  rules?: RegisterOptions<T, Path<T>>;
  format?: 'date';
};

export default function Field<T extends FieldValues>({
  control,
  name,
  label,
  rules,
  format,
  className,
  ...input
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View className="gap-1.5">
          <Text className="font-semibold text-neutral-200">{label}</Text>
          <TextInput
            // El `className` que llegue desde fuera se suma al de aquí; si se
            // pasara dentro de `...input` reemplazaría estos estilos base.
            className={`rounded-xl border bg-tertiary p-3.5 text-white ${
              error ? 'border-red-500' : 'border-secondary'
            } ${className ?? ''}`}
            value={value}
            onChangeText={(text) => onChange(format === 'date' ? formatDateInput(text) : text)}
            onBlur={onBlur}
            autoCapitalize="none"
            placeholderTextColor="#a3a3a3"
            {...input}
          />
          {/* El mensaje sale de las `rules`: quien define la regla define el texto. */}
          {!!error && <Text className="text-xs text-red-400">{error.message}</Text>}
        </View>
      )}
    />
  );
}

function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}
