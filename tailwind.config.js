/** @type {import('tailwindcss').Config} */
const { colors, fonts } = require('./src/theme/tokens');

// Tokens de dict_style.md. Los valores viven en src/theme/tokens.js.
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  // La app es solo oscura (app.json: userInterfaceStyle "dark"). Con 'media',
  // NativeWind lanza un error en web al intentar fijar ese esquema.
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: colors.canvas,
        surface: colors.surface,
        primary: colors.primary,
        secondary: colors.secondary,
        danger: colors.danger,
        disabled: { DEFAULT: colors.disabled, text: colors.disabledText },
        ink: { DEFAULT: colors.ink, inverted: colors.inkInverted },
      },
      fontFamily: {
        data: [fonts.data, 'monospace'],
        'data-medium': [fonts.dataMedium, 'monospace'],
        'data-black': [fonts.dataBlack, 'monospace'],
        body: [fonts.body, 'System'],
        'body-medium': [fonts.bodyMedium, 'System'],
        'body-semibold': [fonts.bodySemibold, 'System'],
        'body-bold': [fonts.bodyBold, 'System'],
      },
      fontSize: {
        display: ['40px', { lineHeight: '44px', letterSpacing: '1px' }],
        h1: ['28px', { lineHeight: '34px', letterSpacing: '0.5px' }],
        h2: ['22px', { lineHeight: '28px' }],
        h3: ['18px', { lineHeight: '24px' }],
        body: ['16px', { lineHeight: '22px' }],
        caption: ['13px', { lineHeight: '18px' }],
        overline: ['11px', { lineHeight: '14px', letterSpacing: '1.5px' }],
        button: ['16px', { lineHeight: '20px', letterSpacing: '0.3px' }],
      },
      // Grid de 8px: OJO, reemplaza los números 1-6 de Tailwind (p-6 = 48px).
      spacing: {
        1: '4px',
        2: '8px',
        3: '16px',
        4: '24px',
        5: '32px',
        6: '48px',
      },
      borderRadius: {
        sm: '8px',
        md: '16px',
        full: '999px',
      },
    },
  },
  plugins: [],
};
