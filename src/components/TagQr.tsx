import * as Sharing from 'expo-sharing';
import { useRef, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import { colors } from '../theme/tokens';
import Button from './Button';
import Notice from './Notice';
import { FormSection } from './Screen';

/**
 * El QR que se imprime y se pega junto a la etiqueta NFC: es lo que escanea
 * el jugador desde la app (Expo Go no lee NFC). Lleva solo el código.
 *
 * Fondo blanco y módulos oscuros a propósito: con los colores invertidos del
 * tema, muchas cámaras no lo leen.
 */
export default function TagQr({ code }: { code: string }) {
  const qrRef = useRef<View>(null);
  const [error, setError] = useState<string | null>(null);

  const share = async () => {
    setError(null);
    try {
      const uri = await captureRef(qrRef, { format: 'png', quality: 1 });
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: `QR de ${code}` });
    } catch (failure) {
      setError((failure as Error).message);
    }
  };

  return (
    <FormSection
      title="QR de la etiqueta"
      description="Imprímelo y pégalo junto a la etiqueta NFC: los jugadores lo escanean desde la app.">
      <View ref={qrRef} collapsable={false} className="items-center gap-2 self-center rounded-md bg-ink p-3">
        <QRCode value={code} size={200} color={colors.inkInverted} backgroundColor={colors.ink} />
        <Text className="font-data text-h3 text-ink-inverted">{code}</Text>
      </View>
      <Notice message={error} />
      {Platform.OS !== 'web' && (
        <Button text="Compartir QR" icon="share-variant" variant="secondary" onPress={() => void share()} />
      )}
    </FormSection>
  );
}
