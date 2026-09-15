import { Pressable, Text } from 'react-native';

/**
 * El botón del proyecto (ver ESTILOS.md). No escribas otro Pressable con
 * fondo primario: usa este, con `secondary` para la variante de borde.
 *
 * Traducción dark NFHunter de la guía: primario `bg-primary`, secundario
 * `border-secondary` con texto claro.
 */
interface Props {
  text: string;
  onPress: () => void;
  /** Se ve apagado y deja de responder. Útil mientras se envía un formulario. */
  disabled?: boolean;
  /** Variante secundaria: borde en vez de fondo lleno. */
  secondary?: boolean;
  className?: string;
}

export default function Button({ text, onPress, disabled, secondary, className }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`items-center rounded-xl p-4 active:opacity-80 disabled:opacity-50 ${
        secondary ? 'border border-secondary' : 'bg-primary'
      } ${className ?? ''}`}>
      <Text className={`font-semibold ${secondary ? 'text-neutral-100' : 'text-white'}`}>
        {text}
      </Text>
    </Pressable>
  );
}
