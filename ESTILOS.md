# Estilos en código · NFHunter móvil

`dict_style.md` dice **qué** (colores, tipografía, estados, háptica). Este
archivo dice **cómo** se aplica en el código. Si chocan, manda
`dict_style.md`: corrige este archivo.

Regla base: primero busca el componente. Solo si no existe, usa clases
sueltas. Una combinación de clases que se repite tres veces se vuelve
componente en `src/components/`.

---

## Dónde viven los tokens

`src/theme/tokens.js` es la única fuente de colores, fuentes y resplandores.
`tailwind.config.js` la lee para generar las clases, y el código la importa
para las props que no aceptan clases (`tintColor`, colores de íconos,
`placeholderTextColor`, estilos de la navegación en `src/theme/navigation.ts`).

**Nunca escribas un hex en un componente.** Usa la clase (`bg-canvas`) o el
token (`colors.primary`).

| Clase | Uso |
|---|---|
| `bg-canvas` | Fondo de toda pantalla |
| `bg-surface` | Tarjetas, inputs, secciones |
| `bg-primary` / `text-primary` | Acción principal, éxito, activo |
| `text-secondary` / `border-secondary` | Foco, selección, información |
| `text-danger` / `border-danger` | Error, acción destructiva |
| `text-ink` | Texto principal |
| `text-ink/70` | Texto de lectura atenuado |
| `text-ink/60` | Metadatos (fechas, contadores) |
| `text-ink-inverted` | Texto sobre `bg-primary` |
| `bg-disabled`, `text-disabled-text` | Deshabilitado |

---

## Espaciado: OJO con los números

El grid es de 8px y **reemplaza** los números 1-6 de Tailwind:

| Clase | Valor |
|---|---|
| `*-1` | 4px |
| `*-2` | 8px |
| `*-3` | 16px |
| `*-4` | 24px |
| `*-5` | 32px |
| `*-6` | 48px |

`p-6` es 48px, no 24px. No uses fracciones (`gap-1.5`, `p-3.5`) ni números
mayores a 6 para espaciar: no están en el grid y en nativo NativeWind los
calcula con otra base. Para tamaños fijos usa valores explícitos:
`h-[44px]`, `min-h-[48px]`.

Radios: `rounded-sm` (8px, inputs y badges), `rounded-md` (16px, tarjetas),
`rounded-full` (botones, avatares).

---

## Tipografía

Las fuentes se cargan en `app/_layout.tsx`. Con fuentes personalizadas el
peso va en la familia, no en `font-bold`: `font-body-semibold`, no
`font-semibold`.

| Componente | Para |
|---|---|
| `<Heading level="display">` | Cifras grandes del HUD |
| `<Heading level="h1" / "h2">` | Títulos (Orbitron) |
| `<Heading level="h3">` | Título de tarjeta o sección (Inter) |
| `<Body>` / `<Body muted>` | Texto de lectura |
| `<Caption>` | Fechas, contadores, ayudas |

No le pases a `Heading`, `Body` o `Caption` una clase de color o de fuente:
chocaría con la suya y el resultado depende del orden del CSS. Si necesitas
otro color, usa `Text` con sus clases completas.

---

## Componentes

| Componente | Para |
|---|---|
| `Button` | Toda acción. `variant`: `primary` (una por pantalla), `secondary`, `danger`. Háptica incluida. |
| `Field` | Campo de react-hook-form: foco cian, válido verde, error rojo con *shake*. |
| `SearchBar` | Buscador de las listas. |
| `Segmented` / `Chip` | Filtros y selectores de pocas opciones. |
| `Card` | Tarjeta. Con `onPress` toda la tarjeta navega (con chevron). |
| `Badge` | Estado en mayúsculas: `primary`, `secondary`, `muted`. |
| `Notice` | Error del servidor o "Cambios guardados". |
| `FormScreen` | Pantalla de formulario (scroll, teclado resuelto). |
| `FormSection` | Agrupa campos relacionados bajo un título. |
| `ListScreen` | Lista con contador, buscador, filtros y estado vacío. |
| `LoadingScreen`, `ErrorScreen`, `EmptyState` | Cargando, error de carga, lista vacía. |
| `DangerZone` | Eliminar, al final de un detalle y separado de Guardar. |
| `HeaderAction` | Botón "Nuevo" del header de una lista. |
| `StatTile` | Cifra grande del HUD con su etiqueta (panel, perfil). |
| `Avatar` / `AvatarEditor` | Foto de perfil (o la inicial) y cómo cambiarla. |
| `CollectibleCard` | Carta del álbum; `locked` la muestra como silueta "???". |
| `HunterCard` | Tarjeta de cazador que se comparte como imagen. |
| `ProgressBar` | "3 de 5 tags" con su barra. |
| `ChatBubble` | Mensaje del chat; los propios a la derecha. |
| `TagQr` | QR imprimible del código de un tag. |

---

## Patrones de pantalla

**Una ruta, dos roles**: cuando admin y jugador comparten ruta (`index`,
`perfil`, `events/[id]`), el archivo de `app/` solo decide cuál pintar según
`user.role`. La versión del jugador vive en `src/screens/player/`, porque
expo-router trataría cualquier archivo de `app/` como una ruta.

**Lista** (tab): `ListScreen` + `useFocusLoad`, que recarga al volver de
crear o editar. El "Nuevo" va en el header (`app/(tabs)/_layout.tsx`), no en
la lista.

**Crear**: `FormScreen` → secciones → `Notice` → un `Button` primario. Al
guardar: `hapticSuccess()` y `router.back()`; la lista ya muestra lo nuevo.

**Detalle**: igual que crear, más:
- el título del header es el nombre del registro (`<Stack.Screen options>`);
- "Guardar cambios" deshabilitado hasta que algo cambie (`formState.isDirty`);
- al guardar, `Notice tone="success"` en vez de una alerta;
- `DangerZone` al final.

**Envío de formularios**: `handleSubmit(submit, hapticError)`. El segundo
argumento hace vibrar cuando la validación falla, y `Field` enfoca el primer
campo con error.

---

## Lo que no se usa

- `Alert.alert`: no funciona en web. Para confirmar una eliminación usa
  `confirmDestructive` (`src/utils/dialog.ts`); para avisar, `Notice`.
- `Pressable` con `Keyboard.dismiss` envolviendo la pantalla: `FormScreen` ya
  cierra el teclado al tocar fuera de un campo.
- Colores de Tailwind por defecto (`text-white`, `text-neutral-400`,
  `red-500`): usa los tokens.
