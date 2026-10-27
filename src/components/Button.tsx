import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import type { ComponentProps } from 'react';
import { Pressable, Text } from 'react-native';
import { ButtonToken } from '../theme/Token';
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
type Variant = keyof typeof ButtonToken.variant;

interface Props {
  text: string;
  onPress: () => void;
  variant?: Variant;
  /** Se ve apagado y deja de responder. Útil mientras se envía un formulario. */
  disabled?: boolean;
  icon?: ComponentProps<typeof MaterialDesignIcons>['name'];
  className?: string;
}

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
      ? ButtonToken.disabled.primary
      : ButtonToken.disabled.outline
    : ButtonToken.variant[variant];

  return (
    <Pressable
      onPress={() => {
        if (variant === 'primary') hapticTap();
        onPress();
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className={`${ButtonToken.container} ${container} ${className ?? ''}`}>
      {!!icon && (
        <MaterialDesignIcons
          name={icon}
          size={ButtonToken.iconSize}
          color={disabled ? colors.disabledText : ICON_COLOR[variant]}
        />
      )}
      <Text
        className={`${ButtonToken.label} ${disabled ? ButtonToken.labelDisabled : ButtonToken.labelVariant[variant]}`}>
        {text}
      </Text>
    </Pressable>
  );
}
