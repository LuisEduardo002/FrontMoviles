import type { TextStyle } from 'react-native';
import { glow } from '../theme/tokens';

/**
 * Estados visuales de un input (dict_style.md §3.2), compartidos por `Field`
 * y `SearchBar`. El borde es siempre de 2px para que cambiar de estado no
 * mueva el contenido ni un píxel.
 */
export type InputState = 'default' | 'focused' | 'valid' | 'error';

const BORDER: Record<InputState, string> = {
  default: 'border-disabled',
  focused: 'border-secondary',
  valid: 'border-primary/60',
  error: 'border-danger',
};

export function inputClassName(state: InputState): string {
  return `min-h-[48px] rounded-sm border-2 bg-surface px-3 py-3 font-body text-body text-ink ${BORDER[state]}`;
}

/** Resplandor del foco. `outlineWidth: 0` quita el anillo azul del navegador. */
export function inputStyle(state: InputState): TextStyle {
  return {
    outlineWidth: 0,
    boxShadow: state === 'focused' ? glow.secondary : undefined,
  };
}
