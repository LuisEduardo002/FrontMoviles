import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { useEffect } from 'react';
import { View } from 'react-native';
import PermissionDenied from '@/components/player/PermissionDenied';
import ScanCamera from '@/components/player/ScanCamera';
import ScanNfcReady from '@/components/player/ScanNfcReady';
import ScanReward from '@/components/player/ScanReward';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Notice from '@/components/ui/Notice';
import { FormScreen } from '@/components/ui/Screen';
import { Body, Heading } from '@/components/ui/Typography';
import { useScan } from '@/hooks/useScan';
import { ScanToken } from '@/theme/Token';
import { colors, glow } from '@/theme/tokens';

/**
 * Registrar un tag encontrado. Muestra la cámara, la recompensa o el inicio
 * (con el código escrito a mano) según el paso; el flujo vive en `useScan`.
 *
 * Props opcionales para abrir directo a cámara desde el FAB de eventos:
 * - `initialMode`: si es `'camera'` abre la cámara al montar.
 * - `triggerKey`: clave que cambia en cada navegación (timestamp) para que el
 *   efecto se dispare incluso si la tab ya estaba activa.
 */
export default function Scan({
  initialMode,
  triggerKey,
}: {
  initialMode?: string;
  triggerKey?: string;
}) {
  const scan = useScan();

  // Abre la cámara directamente cuando se navega con mode=camera
  // (triggerKey cambia cada vez, así el efecto se re-ejecuta siempre)
  useEffect(() => {
    if (initialMode === 'camera') {
      void scan.openCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerKey]);

  if (scan.result) return <ScanReward result={scan.result} onContinue={scan.clearResult} />;

  if (scan.blocked) return <PermissionDenied permission={scan.blocked} onBack={scan.closeBlocked} />;

  if (scan.mode === 'nfc') return <ScanNfcReady isSubmitting={scan.isSubmitting} onCancel={scan.cancel} />;

  if (scan.mode === 'camera') {
    return <ScanCamera onQrScanned={scan.onQrScanned} onCancel={scan.cancel} isSubmitting={scan.isSubmitting} />;
  }

  return (
    <FormScreen centered>
      <View className={ScanToken.intro}>
        <View
          className={ScanToken.introIcon}
          style={{ boxShadow: glow.primary }}>
          <MaterialDesignIcons name="nfc-search-variant" size={ScanToken.introIconSize} color={colors.primary} />
        </View>
        <Heading level="h2" className={ScanToken.centered}>
          ¿Encontraste un tag?
        </Heading>
        <Body muted className={ScanToken.centered}>
          Acerca el celular a la etiqueta o escanea su QR. Tu ubicación se valida al registrarlo.
        </Body>
      </View>

      <Notice message={scan.error} />
      {scan.nfc === 'disabled' && (
        <>
          <Notice message="El NFC está apagado. Enciéndelo para leer la etiqueta." />
          <Button text="Abrir ajustes de NFC" icon="cog-outline" onPress={() => void scan.openNfcSettings()} />
        </>
      )}

      {scan.mode === 'manual' ? (
        <>
          <Field
            control={scan.control}
            name="code"
            label="Código de la etiqueta"
            autoCapitalize="characters"
            placeholder="NFC-MAN-001"
            returnKeyType="send"
            onSubmitEditing={scan.submitCode}
            rules={{ required: 'Escribe el código que ves en la etiqueta' }}
          />
          <Button
            text={scan.isSubmitting ? 'Validando…' : 'Registrar'}
            onPress={scan.submitCode}
            disabled={scan.isSubmitting}
          />
          <Button text="Usar la cámara" variant="secondary" icon="qrcode-scan" onPress={() => void scan.openCamera()} />
        </>
      ) : (
        <>
          {scan.nfc !== 'unsupported' ? (
            <>
              <Button text="Escanear por NFC" icon="nfc-variant" onPress={() => void scan.openNfc()} />
              <Button text="Escanear QR" icon="qrcode-scan" variant="secondary" onPress={() => void scan.openCamera()} />
            </>
          ) : (
            <Button
              text="Escanear QR"
              icon="qrcode-scan"
              onPress={() => void scan.openCamera()}
              disabled={scan.isSubmitting}
            />
          )}
          <Button text="Escribir el código" icon="keyboard-outline" variant="secondary" onPress={scan.openManual} />
        </>
      )}
    </FormScreen>
  );
}
