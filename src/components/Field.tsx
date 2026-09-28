/**
 * Campo de texto conectado a react-hook-form.
 *
 * `Controller` es el puente entre el formulario y un input de React Native:
 * le entrega el valor actual y recibe los cambios. Gracias a eso la pantalla
 * no necesita un `useState` por cada campo.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';
import { Animated, Platform, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors } from '../theme/tokens';
import { inputClassName, inputStyle, type InputState } from './inputStyle';

// Hereda todas las props de TextInput (keyboardType, secureTextEntry...) y
// añade las del formulario.
type Props<T extends FieldValues> = TextInputProps & {
  control: Control<T>;
  /** Nombre del campo dentro del formulario. TypeScript solo acepta los que existen. */
  name: Path<T>;
  label: string;
  /** Texto de ayuda bajo el campo, cuando no hay error. */
  hint?: string;
  /** Reglas de validación: required, minLength, pattern, validate... */
  rules?: RegisterOptions<T, Path<T>>;
  format?: 'date';
};

export default function Field<T extends FieldValues>({
  control,
  name,
  label,
  hint,
  rules,
  format,
  multiline,
  ...input
}: Props<T>) {
  const [isFocused, setFocused] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value, ref }, fieldState: { error, isDirty } }) => {
        const state: InputState = error
          ? 'error'
          : isFocused
            ? 'focused'
            : isDirty && value
              ? 'valid'
              : 'default';

        return (
          <View className="gap-2">
            <Text className="font-body-semibold text-body text-ink">{label}</Text>
            <Shake trigger={error?.message}>
              <TextInput
                // Con la ref, react-hook-form enfoca el primer campo con error al
                // enviar: en formularios largos el usuario ve qué falló.
                ref={ref}
                className={`${inputClassName(state)} ${multiline ? 'min-h-[96px]' : ''}`}
                style={inputStyle(state)}
                value={value}
                onChangeText={(text) => onChange(format === 'date' ? formatDateInput(text) : text)}
                onFocus={() => setFocused(true)}
                onBlur={() => {
                  setFocused(false);
                  onBlur();
                }}
                autoCapitalize="none"
                placeholderTextColor={colors.disabledText}
                multiline={multiline}
                textAlignVertical={multiline ? 'top' : 'center'}
                {...input}
              />
            </Shake>
            {/* El mensaje sale de las `rules`: quien define la regla define el texto. */}
            {error ? (
              <Text className="font-body text-caption text-danger">{error.message}</Text>
            ) : (
              !!hint && <Text className="font-body text-caption text-ink/60">{hint}</Text>
            )}
          </View>
        );
      }}
    />
  );
}

/** Sacude a su hijo cuando `trigger` pasa a tener un valor (aparece un error). */
function Shake({ trigger, children }: { trigger?: string; children: ReactNode }) {
  const offset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!trigger) return;
    const step = (toValue: number) =>
      Animated.timing(offset, {
        toValue,
        duration: 50,
        useNativeDriver: Platform.OS !== 'web',
      });
    Animated.sequence([step(-6), step(6), step(-4), step(4), step(0)]).start();
  }, [trigger, offset]);

  return <Animated.View style={{ transform: [{ translateX: offset }] }}>{children}</Animated.View>;
}

function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}
