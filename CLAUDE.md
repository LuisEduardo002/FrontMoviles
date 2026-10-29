# NFHunter · Móvil

Expo SDK 57 + expo-router + NativeWind 4 + TypeScript. Antes de usar una API de Expo, lee la doc de la versión: https://docs.expo.dev/versions/v57.0.0/

## Estructura
`app/` (rutas: solo montan) → `src/components/<dominio>/` (solo pintan) → `src/hooks/` (estado y lógica) → `src/api/` (endpoints; `client.ts` es el único `fetch`).
- `src/session/`: sesión (contexto, token en SecureStore, JWT). `src/theme/tokens.js`: única fuente de colores, degradados, sombras, fuentes y glow.
- `src/components/ui/`: kit base. `src/types.ts`: contrato con la API. Alias `@/` = `src/`.
- Estilo: `dict_style.md` (qué, manda) y `ESTILOS.md` (cómo).

## Comandos
- Expo Go (sin NFC ni mapa): `npx expo start`
- Dev build Android: `eas build -p android --profile development` (o `npx expo run:android`), luego `npx expo start --dev-client`
- APK de prueba: `eas build -p android --profile preview`
- Tipos: `npx tsc --noEmit` · Lint: `npx expo lint` (pendiente de configurar) · Dependencias: `npx expo-doctor`

## Convenciones
- Nombres, textos y comentarios en español; los comentarios explican el porqué.
- Cargas con `useFocusLoad`; listas con `ListScreen`; formularios con `FormScreen` + `Field`. Toda pantalla con datos tiene carga, vacío y error (con "Reintentar").
- Errores: mensaje del servidor en `Notice`. Nada de `Alert` (usar `confirmDestructive`). Háptica con `utils/haptics.ts`.
- Nada de hex ni colores por defecto de Tailwind. Grid de 8 px: `p-3` = 16 px. Contraste ≥ 4.5:1.
- Animaciones nuevas con Reanimated. Botones flotantes y teclado con `useSafeAreaInsets`.
- NFC (solo Android, `utils/nfc.ts`) y el mapa (MapLibre + OSM) necesitan el dev build: import protegido para que la app siga abriendo en Expo Go. QR y código manual siempre disponibles.
- El escaneo siempre va por `registerScan` (`POST /scans`), sea NFC, QR o manual.

## Reglas
- Dependencias con `npx expo install`, nunca `npm install` suelto.
- No tocar `.env`. Si cambia un endpoint del backend, actualizar `src/api/` y `src/types.ts`.
- Nada de Git que modifique el repo; sugerir el mensaje de commit.
