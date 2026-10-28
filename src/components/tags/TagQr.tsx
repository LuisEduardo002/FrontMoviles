import { Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Button from '@/components/ui/Button';
import Notice from '@/components/ui/Notice';
import { FormSection } from '@/components/ui/Screen';
import { useShareImage } from '@/hooks/useShareImage';
import { TagQrToken } from '@/theme/Token';
import { colors } from '@/theme/tokens';

/**
 * El QR que se imprime y se pega junto a la etiqueta NFC: es lo que escanea
 * el jugador desde la app (Expo Go no lee NFC). Lleva solo el código.
 *
 * Fondo blanco y módulos oscuros a propósito: con los colores invertidos del
 * tema, muchas cámaras no lo leen.
 */
export default function TagQr({ code }: { code: string }) {
  const { ref, share, isSharing, error, canShare } = useShareImage(`QR de ${code}`);

  return (
    <FormSection
      title="QR de la etiqueta"
      description="Imprímelo y pégalo junto a la etiqueta NFC: los jugadores lo escanean desde la app.">
      <View ref={ref} collapsable={false} className={TagQrToken.container}>
        <QRCode value={code} size={TagQrToken.qrSize} color={colors.inkInverted} backgroundColor={colors.ink} />
        <Text className={TagQrToken.code}>{code}</Text>
      </View>
      <Notice message={error} />
      {canShare && (
        <Button
          text={isSharing ? 'Preparando…' : 'Compartir QR'}
          icon="share-variant"
          variant="secondary"
          onPress={() => void share()}
          disabled={isSharing}
        />
      )}
    </FormSection>
  );
}
