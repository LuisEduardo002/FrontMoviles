/**
 * Tokens de diseño de NFHunter (ver `dict_style.md`, la fuente de verdad).
 *
 * Es CommonJS a propósito: `tailwind.config.js` lo importa con `require` y la
 * app lo importa como módulo normal. Así un color vive en un solo lugar, tanto
 * para las clases (`bg-canvas`) como para las props que no aceptan clases
 * (colores de la barra de tabs, íconos, `placeholderTextColor`...).
 */

const colors = {
  canvas: '#0B1220',
  surface: '#111827',
  primary: '#39FF14',
  secondary: '#22D3EE',
  danger: '#FF2A2A',
  disabled: '#374151',
  disabledText: '#6B7280',
  ink: '#E5E7EB',
  inkInverted: '#0B1220',
};

/** Nombres con los que `useFonts` registra cada peso (ver app/_layout.tsx). */
const fonts = {
  data: 'Orbitron_700Bold',
  dataMedium: 'Orbitron_500Medium',
  dataBlack: 'Orbitron_800ExtraBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemibold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
};

/** Resplandor neón de los estados de éxito, foco y activo. */
const glow = {
  primary: '0 0 16px rgba(57, 255, 20, 0.35)',
  secondary: '0 0 12px rgba(34, 211, 238, 0.35)',
  danger: '0 0 12px rgba(255, 42, 42, 0.3)',
  card: '0 8px 24px rgba(0, 0, 0, 0.4)',
};

module.exports = { colors, fonts, glow };
