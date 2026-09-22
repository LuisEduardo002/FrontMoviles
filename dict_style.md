# dict_style.md · NFHunter Design System

> **Single Source of Truth** de diseño para NFHunter. Todo el equipo (diseño y
> desarrollo) debe copiar tokens y comportamientos de aquí, no inventar
> variantes nuevas. Compatible con React Native + NativeWind / Tailwind CSS.
>
> Si una regla de este documento entra en conflicto con `ESTILOS.md` o
> `tailwind.config.js`, este documento es la referencia objetivo hacia la que
> migrar; actualiza esos archivos para que coincidan.

---

## 0. Identidad de marca

| Campo | Valor |
|---|---|
| Nombre | **NFHunter** |
| Eslogan | "Cada esquina guarda una historia. Cada tag, un trofeo." |
| Personalidad | Exploración urbana, misterio, tecnología, gamificación |
| Estilo visual | Cyberpunk / Dark Mode nativo (la app **no** tiene modo claro) |

**Identidad de interacción (Motion & Feel).** La app debe sentirse rápida,
táctil y recompensante:

- **Haptic feedback** obligatorio en:
  - Escaneo de tag NFC exitoso → impacto fuerte (`ImpactFeedbackStyle.Heavy` /
    `notificationAsync(Success)`).
  - Pulsación de un botón primario → impacto medio (`ImpactFeedbackStyle.Medium`).
  - Error de escaneo, GPS inválido, validación fallida → notificación de error
    (`notificationAsync(Error)`), doble pulso corto.
- **Transiciones**: rápidas (150–220ms), sin fricción. Evitar easing largo o
  "bouncy" — esto es tecnología, no un juego infantil.
- **Glow / resplandor neón**: todo estado de éxito o "activo" usa un
  resplandor (`shadowColor` + `shadowOpacity` en iOS, `elevation` + tinte en
  Android, o `box-shadow` con el color de acento en web) en el color de
  acento correspondiente (`#39FF14` éxito, `#22D3EE` foco/info).

---

## 1. Tipografía (Typography Tokens)

### 1.1 Familias

| Uso | Familia | Fallback |
|---|---|---|
| **Display & Headers** (títulos, contadores, branding, HUD) | Fuente "Data" (pixel/tech, ej. `Orbitron`, `Share Tech Mono` o `Chakra Petch`) | `monospace` |
| **Body & UI Text** (lectura, inputs, descripciones) | `Inter` o `Plus Jakarta Sans` | `System` (San Francisco / Roboto) |

> Registrar ambas familias con `expo-font` / `useFonts` antes de renderizar
> cualquier pantalla (splash bloqueante hasta que carguen).

### 1.2 Escala tipográfica

| Token | Uso | Tamaño | Line-height | Peso | Familia | Tracking |
|---|---|---|---|---|---|---|
| `display` | Contador de trofeos, HUD de escaneo | 40px | 44px | 800 (ExtraBold) | Data | +1px |
| `h1` | Título de pantalla | 28px | 34px | 700 (Bold) | Data | +0.5px |
| `h2` | Título de sección / tarjeta destacada | 22px | 28px | 700 (Bold) | Data | 0 |
| `h3` | Subtítulo / título de tarjeta en lista | 18px | 24px | 600 (SemiBold) | Body | 0 |
| `body` | Texto de lectura, descripciones | 16px | 22px | 400 (Regular) | Body | 0 |
| `bodyStrong` | Texto de lectura enfatizado, labels de campo | 16px | 22px | 600 (SemiBold) | Body | 0 |
| `caption` | Metadatos, fecha, lugar, id | 13px | 18px | 400 (Regular) | Body | 0 |
| `overline` | Etiquetas de estado en mayúsculas (badges) | 11px | 14px | 700 (Bold) | Data | +1.5px, uppercase |
| `button` | Texto de botones | 16px | 20px | 700 (Bold) | Body | +0.3px |

**NativeWind (Tailwind) — sugerido `tailwind.config.js`:**

```js
fontFamily: {
  data: ['Orbitron_700Bold', 'monospace'],
  'data-medium': ['Orbitron_500Medium', 'monospace'],
  body: ['Inter_400Regular', 'System'],
  'body-medium': ['Inter_500Medium', 'System'],
  'body-semibold': ['Inter_600SemiBold', 'System'],
  'body-bold': ['Inter_700Bold', 'System'],
},
fontSize: {
  display: ['40px', { lineHeight: '44px' }],
  h1: ['28px', { lineHeight: '34px' }],
  h2: ['22px', { lineHeight: '28px' }],
  h3: ['18px', { lineHeight: '24px' }],
  body: ['16px', { lineHeight: '22px' }],
  caption: ['13px', { lineHeight: '18px' }],
  overline: ['11px', { lineHeight: '14px' }],
},
```

---

## 2. Paleta de colores (Color System)

| Token | Hex | Rol |
|---|---|---|
| `canvas` | `#0B1220` | Fondo base de toda pantalla (Azul muy oscuro) |
| `surface` | `#111827` | Contenedores, tarjetas, inputs, modales (Gris azulado oscuro) |
| `primary` | `#39FF14` | Acento neón principal — CTA, éxito, estado activo (Verde brillante) |
| `secondary` | `#22D3EE` | Acento secundario — foco, información, selección (Cian) |
| `text` | `#E5E7EB` | Texto principal sobre `canvas`/`surface` (Gris claro) |
| `text-on-primary` | `#0B1220` | Texto/ícono sobre fondos `primary` (contraste) |
| `danger` | `#FF2A2A` | Error, scan fallido, GPS inválido, inputs inválidos (Rojo neón) |
| `disabled-bg` | `#374151` | Fondo de elementos deshabilitados (Gris opaco) |
| `disabled-text` | `#6B7280` | Texto de elementos deshabilitados |

**NativeWind (Tailwind) — sugerido `tailwind.config.js`:**

```js
colors: {
  canvas: '#0B1220',
  surface: '#111827',
  primary: '#39FF14',
  secondary: '#22D3EE',
  danger: '#FF2A2A',
  disabled: { DEFAULT: '#374151', text: '#6B7280' },
  ink: { DEFAULT: '#E5E7EB', inverted: '#0B1220' },
},
```

> Todo color se referencia por token (`bg-canvas`, `text-ink`, `border-secondary`…),
> nunca por hex literal en componentes.

---

## 3. Comportamiento de componentes y estados (UI States)

### 3.1 Botones (Buttons)

#### Primary Button — Ej. "Escanear", "Reclamar"

| Estado | Fondo | Texto | Borde/Radio | Extra |
|---|---|---|---|---|
| Default | `#39FF14` | `#0B1220`, `button` | `rounded-full` (999px) | Sin sombra |
| Pressed / Active | `#39FF14` a 80% opacidad (o `#2ECC0F`) | `#0B1220` | igual | `shadow-inner`, **haptic fuerte** |
| Disabled | `#374151` | `#6B7280` | igual | Sin sombra, sin haptic |

```tsx
// Default
className="items-center rounded-full bg-primary px-6 py-4 active:opacity-80 disabled:bg-disabled"
```

#### Secondary Button / Ghost — Ej. "Ver detalles", "Cancelar"

| Estado | Fondo | Borde | Texto |
|---|---|---|---|
| Default | Transparente | `2px` `#22D3EE` | `#22D3EE` |
| Pressed | `#22D3EE` a 15% opacidad | `2px` `#22D3EE` | `#22D3EE` |
| Disabled | Transparente | `2px` `#374151` | `#6B7280` |

```tsx
className="items-center rounded-full border-2 border-secondary bg-transparent px-6 py-4 active:bg-secondary/15 disabled:border-disabled disabled:text-disabled-text"
```

### 3.2 Inputs (campos de texto, barra de búsqueda)

| Estado | Fondo | Borde | Texto | Extra |
|---|---|---|---|---|
| Default | `#111827` | transparente o `1px #374151` | `#E5E7EB`, placeholder gris oscuro | — |
| Focused | `#111827` (sin cambio) | `2px #22D3EE` | `#E5E7EB` | Glow cian alrededor del borde |
| Filled (válido) | `#111827` | `1px #39FF14` | `#E5E7EB` | — |
| Error | `#111827` | `2px #FF2A2A` | `#E5E7EB` | Texto de ayuda en `#FF2A2A` debajo + animación *shake* al aparecer el error |

```tsx
// Base
className="rounded-lg bg-surface px-4 py-3 text-body text-ink border border-transparent
  focus:border-2 focus:border-secondary
  data-[valid=true]:border data-[valid=true]:border-primary
  data-[error=true]:border-2 data-[error=true]:border-danger"
```

> El *shake* de error se implementa con `Animated`/`react-native-reanimated`
> (secuencia de `translateX`: 0 → -6 → 6 → -4 → 4 → 0 en ~300ms), disparado
> junto con el haptic de error.

### 3.3 Tarjetas (Cards / Modales)

| Estado | Fondo | Borde | Radio | Sombra/Elevación |
|---|---|---|---|---|
| Default | `#111827` | ninguno | `16px` | Sombra sutil oscura, elevación alta para separarse de `#0B1220` |
| Active / Selected | `#111827` | `1.5px #22D3EE` o `1.5px #39FF14` (según contexto) | `16px` | Igual + glow leve del color del borde |

```tsx
// Default
className="rounded-md bg-surface p-5 shadow-lg shadow-black/40"

// Selected (ej. carta de inventario elegida)
className="rounded-md border-[1.5px] border-secondary bg-surface p-5 shadow-lg shadow-secondary/30"
```

---

## 4. Layout y espaciado (Design Tokens)

### 4.1 Grid — múltiplos de 8px

| Token | Valor |
|---|---|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 16px |
| `space-4` | 24px |
| `space-5` | 32px |
| `space-6` | 48px |

Uso: separación entre hijos con `gap-*`, nunca márgenes individuales por hijo.

### 4.2 Border radius

| Token | Valor | Uso |
|---|---|---|
| `rounded-sm` | 8px | Inputs, badges |
| `rounded-md` | 16px | Cards, modales |
| `rounded-full` | 999px | Botones principales, avatares |

**NativeWind (Tailwind) — sugerido `tailwind.config.js`:**

```js
spacing: {
  1: '4px', 2: '8px', 3: '16px', 4: '24px', 5: '32px', 6: '48px',
},
borderRadius: {
  sm: '8px',
  md: '16px',
  full: '999px',
},
```

---

## 5. Resumen rápido de tokens

```js
// tailwind.config.js — extend consolidado NFHunter
module.exports = {
  theme: {
    extend: {
      colors: {
        canvas: '#0B1220',
        surface: '#111827',
        primary: '#39FF14',
        secondary: '#22D3EE',
        danger: '#FF2A2A',
        disabled: { DEFAULT: '#374151', text: '#6B7280' },
        ink: { DEFAULT: '#E5E7EB', inverted: '#0B1220' },
      },
      fontFamily: {
        data: ['Orbitron_700Bold', 'monospace'],
        body: ['Inter_400Regular', 'System'],
      },
      borderRadius: {
        sm: '8px',
        md: '16px',
        full: '999px',
      },
    },
  },
};
```

---

## 6. Reglas de uso

1. Primero busca el componente ya existente (`Button`, `Field`, `Card`). Solo
   si no existe, usa las clases sueltas de este documento.
2. Si una combinación de clases se repite 3+ veces, se vuelve componente en
   `src/components/`.
3. Todo color y tamaño se referencia por token, nunca por valor literal
   (hex o px) dentro de un componente.
4. Todo estado de éxito/error dispara haptic feedback — ningún feedback
   visual va solo.
