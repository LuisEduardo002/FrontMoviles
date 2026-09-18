# NFHunter — app móvil

Frontend en React Native + Expo del juego ARG NFHunter. Hoy implementa la capa
de conexión con el backend y la autenticación (registro, ingreso y sesión
persistente).

## Arrancar

```bash
npm install
cp .env.example .env     # y ajustar la IP (ver abajo)
npm start                # luego: a (Android), i (iOS), w (web)
```

## Cambiar la IP del backend

La dirección del servidor vive en **un solo lugar**: la variable
`EXPO_PUBLIC_API_URL` del archivo `.env`.

```
EXPO_PUBLIC_API_URL=http://192.168.114.241:3000
```

Esa IP es la del computador donde corre el backend y **cambia cada vez que se
reconecta al WiFi**. Para averiguar la actual:

```bash
hostname -I          # Linux
ipconfig getifaddr en0   # macOS
```

Cuál usar depende de dónde corra la app:

| Entorno | Base URL |
|---|---|
| Dispositivo físico con Expo Go (mismo WiFi) | `http://<IP-DEL-COMPUTADOR>:3000` |
| Emulador de Android | `http://10.0.2.2:3000` |
| Simulador de iOS | `http://localhost:3000` |
| Web (`npm run web`) | `http://localhost:3000` |

`localhost` **no** sirve desde un celular ni desde el emulador de Android:
apunta al propio dispositivo, no al computador.

Dos detalles:

- La URL va **sin `/api`**. El backend no define un prefijo global, así que sus
  rutas son `/auth/login` y `/auth/register`. (`/api/docs` es solo Swagger.)
- Al cambiar `.env` hay que **recargar la app por completo** (sacudir el
  dispositivo → Reload). No basta con guardar el archivo.

Si `.env` no existe, la app usa el valor de respaldo que está en
[`src/config/env.ts`](src/config/env.ts).

## Levantar el backend

```bash
cd ~/Documentos/NFHunter_Backend
docker compose up -d    # PostgreSQL + PostGIS en el puerto 5434
npm run start:dev       # API en el puerto 3000
```

Para comprobar que responde: `curl http://localhost:3000` devuelve texto plano.
La documentación a mano está en `http://localhost:3000/api/docs` (los schemas
salen vacíos: el plugin de `@nestjs/swagger` no está activado).

## Cómo está organizado

| Carpeta | Qué hay |
|---|---|
| `app/` | Pantallas. El enrutado es por archivos (expo-router). |
| `src/config/` | La dirección del backend y el tiempo máximo de espera. |
| `src/api/` | La única capa que habla con el servidor: `client.ts` (fetch) y `auth.ts` (endpoints). |
| `src/session/` | Sesión: contexto de React, guardado del token y lectura del JWT. |
| `src/types.ts` | El contrato con la API, en tipos. |
| `src/components/` | Piezas de interfaz reutilizables. |

## Sobre la sesión

- El token se guarda en el **llavero del sistema** (`expo-secure-store`). En web
  no existe SecureStore, así que ahí cae a `localStorage`.
- Dura **7 días**. Al abrir la app se lee el token guardado y se revisa su fecha
  de vencimiento *localmente*: el backend no tiene ningún endpoint protegido
  contra el cual validarlo. Si ya venció, se borra y se pide entrar de nuevo.
- El registro devuelve el token directamente, así que **no hay que iniciar
  sesión después de crear la cuenta**.

## Límites conocidos del backend

- Los únicos endpoints que existen son `POST /auth/register`, `POST /auth/login`
  y `GET /`. No hay perfil, ni tags, ni escaneos.
- La respuesta de `/auth` trae solo `id`, `email` y `role`. **El `nickname`, los
  puntos y el nivel no se pueden mostrar** hasta que el backend los devuelva.
- El servidor no valida el cuerpo de las peticiones: si falta un campo responde
  `500`, no `400`. Por eso los formularios validan antes de enviar.
