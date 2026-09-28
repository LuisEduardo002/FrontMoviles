/**
 * Estilo de headers y barra de tabs. Son props de React Navigation, no
 * clases, así que toman los colores y fuentes directo de los tokens.
 */

import { colors, fonts } from './tokens';

const header = {
  headerStyle: { backgroundColor: colors.canvas },
  headerShadowVisible: false,
  headerTintColor: colors.ink,
  headerTitleStyle: { fontFamily: fonts.data, fontSize: 18 },
} as const;

export const stackScreenOptions = {
  ...header,
  contentStyle: { backgroundColor: colors.canvas },
  headerBackButtonDisplayMode: 'minimal',
  // Transición corta (dict_style.md §0): 150-220 ms, sin rebote.
  animation: 'slide_from_right',
  animationDuration: 200,
} as const;

export const tabScreenOptions = {
  ...header,
  sceneStyle: { backgroundColor: colors.canvas },
  tabBarStyle: {
    backgroundColor: colors.surface,
    borderTopColor: colors.disabled,
  },
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.disabledText,
  tabBarLabelStyle: { fontFamily: fonts.bodySemibold, fontSize: 11 },
  animation: 'fade',
} as const;
