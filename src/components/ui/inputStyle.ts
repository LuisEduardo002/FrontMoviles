import type { TextStyle } from 'react-native';
import { InputToken } from '@/theme/Token';
import { glow } from '@/theme/tokens';

/**
 * Estados visuales de un input (dict_style.md §3.2), compartidos por `Field`
 * y `SearchBar`. El borde es siempre de 2px para que cambiar de estado no
 * mueva el contenido ni un píxel.
 */
export type InputState = 'default' | 'focused' | 'valid' | 'error';

export function inputClassName(state: InputState): string {
  return `${InputToken.base} ${InputToken.border[state]}`;
}

/** Resplandor del foco. `outlineWidth: 0` quita el anillo azul del navegador. */
export function inputStyle(state: InputState): TextStyle {
  return {
    outlineWidth: 0,
    boxShadow: state === 'focused' ? glow.secondary : undefined,
  };
}
