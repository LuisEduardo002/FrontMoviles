import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import type { ComponentProps } from 'react';
import { Pressable, Text } from 'react-native';
import { colors } from '../theme/tokens';
import { hapticTap } from '../utils/haptics';

/**
 * El botón del proyecto (dict_style.md §3.1). No escribas otro Pressable con
 * fondo primario: usa este.
 *
 * - `primary`: la acción principal de la pantalla. Una sola por pantalla.
 * - `secondary`: acciones alternativas ("Cancelar", "Crear tag").
 * - `danger`: acciones destructivas. Va separada de las demás, al final.
 */
type Variant = 'primary' | 'secondary' | 'danger';

interface Props {
  text: string;
  onPress: () => void;
  variant?: Variant;
  /** Se ve apagado y deja de responder. Útil mientras se envía un formulario. */
  disabled?: boolean;
  icon?: ComponentProps<typeof MaterialDesignIcons>['name'];
  className?: string;
}

const CONTAINER: Record<Variant, string> = {
  primary: 'bg-primary active:opacity-80',
  secondary: 'border-2 border-secondary active:bg-secondary/15',
  danger: 'border-2 border-danger active:bg-danger/15',
};

const LABEL: Record<Variant, string> = {
  primary: 'text-ink-inverted',
  secondary: 'text-secondary',
  danger: 'text-danger',
};

const ICON_COLOR: Record<Variant, string> = {
  primary: colors.inkInverted,
  secondary: colors.secondary,
  danger: colors.danger,
};

export default function Button({
  text,
  onPress,
  variant = 'primary',
  disabled,
  icon,
  className,
}: Props) {
  const container = disabled
    ? variant === 'primary'
      ? 'bg-disabled'
      : 'border-2 border-disabled'
    : CONTAINER[variant];

  return (
    <Pressable
      onPress={() => {
        if (variant === 'primary') hapticTap();
        onPress();
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className={`min-h-[48px] flex-row items-center justify-center gap-2 rounded-full px-4 py-3 ${container} ${className ?? ''}`}>
      {!!icon && (
        <MaterialDesignIcons
          name={icon}
          size={20}
          color={disabled ? colors.disabledText : ICON_COLOR[variant]}
        />
      )}
      <Text
        className={`font-body-bold text-button ${disabled ? 'text-disabled-text' : LABEL[variant]}`}>
        {text}
      </Text>
    </Pressable>
  );
}
