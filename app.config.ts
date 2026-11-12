import type { ExpoConfig } from 'expo/config';

/**
 * Config dinámica: `app.json` no interpola variables de entorno y la llave de
 * Google Maps no debe quedar escrita en el repositorio.
 *
 * Android es el único que necesita llave para una build propia (dev build o
 * APK). En Expo Go ya viene una, y en iOS el mapa usa Apple Maps. Sin llave,
 * una build Android muestra el mapa en gris, pero la app abre igual.
 *
 * La llave se restringe en Google Cloud por paquete (`com.nfhunter.app`) y
 * SHA-1, así que no es un secreto de alto riesgo; aun así, vive en `.env`.
 */
export default ({ config }: { config: ExpoConfig }): ExpoConfig => ({
  ...config,
  plugins: [
    ...(config.plugins ?? []),
    [
      'react-native-maps',
      {
        androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_ANDROID_KEY ?? '',
      },
    ],
  ],
});
