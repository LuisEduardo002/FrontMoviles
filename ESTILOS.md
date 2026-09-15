# Estilos estándar · NFHunter móvil

Cadenas de NativeWind que usa la app. **Copia de aquí, no inventes una
variante nueva.** Si una combinación de clases se repite tres veces, se
vuelve componente en `src/components/`.

Traducción dark de la guía de referencia: misma estructura (qué clase cumple
qué papel en cada tipo de pantalla), colores de la paleta NFHunter definidos
en `tailwind.config.js` (`primary #722770`, `secondary #551d54`,
`tertiary #391338`, `base #1c0a1c`).

Regla base: primero busca el componente (`Button`, `Field`). Solo si no
existe, usa las clases sueltas de este documento.

---

## Paleta

| Papel | Clase | Nota |
|---|---|---|
| Fondo de pantalla | `bg-base` | Todas las pantallas |
| Superficie (tarjeta) | `bg-tertiary` + `border border-secondary` | |
| Primario / acción | `bg-primary`, texto `text-white` | Botones, iconos destacados |
| Texto fuerte | `text-white` | Títulos y contenido |
| Texto secundario | `text-neutral-200` | Instrucciones |
| Texto tenue / metadatos | `text-neutral-400` | Descripciones, fechas, lugar |
| Error | `text-red-400` (campo), `border-red-500/40 bg-red-500/10 text-red-200` (formulario) | |

`placeholderTextColor="#a3a3a3"` va como **prop**, no como clase: NativeWind
no traduce `placeholder:` en React Native.

---

## Contenedores

```tsx
// Pantalla simple
<View className="flex-1 gap-6 bg-base p-6">

// Pantalla centrada (login, acuse de recibo, error)
<View className="flex-1 justify-center gap-5 bg-base p-6">

// Pantalla con scroll (formularios largos)
<ScrollView
  className="flex-1 bg-base"
  contentContainerClassName="gap-5 p-6"
  keyboardShouldPersistTaps="handled">

// Tarjeta
<View className="gap-3 rounded-2xl border border-secondary bg-tertiary p-5">

// Cargando
<View className="flex-1 items-center justify-center bg-base">
  <ActivityIndicator color="#fff" />
</View>
```

El espaciado entre hijos es `gap-*`, nunca `mt-*` en cada hijo.
`gap-6` entre bloques, `gap-5` entre campos de formulario, `gap-3`
dentro de una tarjeta, `gap-1.5` entre etiqueta y control.

---

## Tipografía

```tsx
<Text className="text-2xl font-bold text-white">   // Título de pantalla
<Text className="text-xl font-bold text-white">    // Título de sección/tarjeta
<Text className="text-lg font-bold text-white">    // Título de tarjeta en lista
<Text className="text-neutral-200">                // Texto secundario
<Text className="text-sm text-neutral-400">        // Descripción, lugar
<Text className="text-xs text-neutral-400">        // Fecha, id, metadato
<Text className="font-semibold text-neutral-200">  // Etiqueta de un campo
```

---

## Botón → usa `Button`

`src/components/Button.tsx` es **el** botón del proyecto. No escribas otro
`Pressable` con fondo primario.

```tsx
import Button from '../src/components/Button';

// Primario
<Button text="Participar" onPress={join} />

// Secundario (borde, sin relleno)
<Button text="Ver detalles" onPress={openDetails} secondary />

// Deshabilitado mientras se envía: el texto también cambia
<Button
  text={formState.isSubmitting ? 'Entrando…' : 'Entrar'}
  onPress={handleSubmit(submit)}
  disabled={formState.isSubmitting}
/>

// Ajuste puntual (se suma a las clases base, ej. botón en fila)
<Button text="Participar" onPress={join} className="flex-1" />
```

Props: `text`, `onPress`, `disabled?`, `secondary?`, `className?`.

| Parte | Clases |
|---|---|
| Base | `items-center rounded-xl p-4 active:opacity-80 disabled:opacity-50` |
| Primario | `bg-primary` + texto `font-semibold text-white` |
| Secundario | `border border-secondary` + texto `font-semibold text-neutral-100` |

---

## Campo de texto → usa `Field`

Igual que la guía: etiqueta, borde rojo al fallar y mensaje de error.
Solo dentro de un formulario de react-hook-form. En dark, el input es
`bg-tertiary` con borde `border-secondary` y texto blanco.

---

## Teclado

Toda pantalla con campos envuelve su contenido para que tocar fuera cierre
el teclado (si no, el teclado tapa el botón y no deja salir):

```tsx
import { Keyboard, Pressable } from 'react-native';

<Pressable className="flex-1 bg-base" onPress={Keyboard.dismiss}>
  {/* contenido */}
</Pressable>
```

En `ScrollView`, además: `keyboardShouldPersistTaps="handled"` y
`keyboardDismissMode="on-drag"`, para que arrastrar también lo oculte.

---

## Errores del formulario completo

Un solo formato para el error que devuelve el servidor (en pantalla, no en
consola):

```tsx
{!!formState.errors.root && (
  <Text className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-center text-red-200">
    {formState.errors.root.message}
  </Text>
)}
```

---

## Lista

```tsx
<FlatList
  contentContainerClassName="gap-4 p-6"
  ListHeaderComponent={...}
  ...
/>
```

---

## Enlace

```tsx
<Link href="/login" className="text-center font-semibold text-neutral-100">
```
