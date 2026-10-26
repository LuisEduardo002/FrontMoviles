import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

/**
 * Elige una foto (galería o cámara), la recorta cuadrada y la deja en un JPEG
 * de 512 px: pesa unos pocos KB y el backend acepta hasta 2 MB.
 *
 * Devuelve la uri lista para `uploadAvatar`, o null si el usuario canceló.
 * Lanza un Error con un mensaje para mostrar si no hay permiso.
 */
export async function pickAvatar(source: 'library' | 'camera'): Promise<string | null> {
  const permission =
    source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error(
      source === 'camera'
        ? 'Sin permiso para usar la cámara. Actívalo en los ajustes del celular.'
        : 'Sin permiso para ver tus fotos. Actívalo en los ajustes del celular.',
    );
  }

  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  };
  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);
  if (result.canceled || !result.assets?.[0]) return null;

  const image = await ImageManipulator.manipulate(result.assets[0].uri)
    .resize({ width: 512, height: 512 })
    .renderAsync();
  const saved = await image.saveAsync({ format: SaveFormat.JPEG, compress: 0.8 });
  return saved.uri;
}
