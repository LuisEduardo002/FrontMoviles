import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { View } from 'react-native';
import Button from '@/components/ui/Button';
import { FormScreen } from '@/components/ui/Screen';
import { Body, Heading } from '@/components/ui/Typography';
import { ScanNfcReadyToken } from '@/theme/Token';
import { colors, glow } from '@/theme/tokens';

/** "Listo para escanear": espera a que el jugador acerque el celular al sticker. */
export default function ScanNfcReady({ isSubmitting, onCancel }: { isSubmitting: boolean; onCancel: () => void }) {
  return (
    <FormScreen centered>
      <View className={ScanNfcReadyToken.intro}>
        <View
          className={ScanNfcReadyToken.icon}
          style={{ boxShadow: glow.primary }}>
          <MaterialDesignIcons name="nfc-variant" size={ScanNfcReadyToken.iconSize} color={colors.primary} />
        </View>
        <Heading level="h2" className={ScanNfcReadyToken.centered}>
          {isSubmitting ? 'Validando tu ubicación…' : 'Listo para escanear'}
        </Heading>
        <Body muted className={ScanNfcReadyToken.centered}>
          {isSubmitting
            ? 'Un momento, confirmamos que estás junto al tag.'
            : 'Acerca la parte trasera del celular a la etiqueta y mantenla quieta.'}
        </Body>
      </View>
      <Button text="Cancelar" variant="secondary" onPress={onCancel} disabled={isSubmitting} />
    </FormScreen>
  );
}
