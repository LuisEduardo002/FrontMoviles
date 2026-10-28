import { CameraView } from 'expo-camera';
import { Text, View } from 'react-native';
import Button from '@/components/ui/Button';
import { ScanCameraToken } from '@/theme/Token';
import { glow } from '@/theme/tokens';

/** La cámara a pantalla completa con el marco donde va el QR. */
export default function ScanCamera({
  onQrScanned,
  onCancel,
  isSubmitting,
}: {
  onQrScanned: (data: string) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  return (
    <View className={ScanCameraToken.container}>
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={({ data }) => onQrScanned(data)}
      />
      <View pointerEvents="box-none" className={ScanCameraToken.overlay}>
        <View className={ScanCameraToken.frame} style={{ boxShadow: glow.primary }} />
        <Text className={ScanCameraToken.hint}>
          {isSubmitting ? 'Validando tu ubicación…' : 'Apunta al QR de la etiqueta'}
        </Text>
      </View>
      <View className={ScanCameraToken.cancel}>
        <Button text="Cancelar" variant="secondary" onPress={onCancel} disabled={isSubmitting} />
      </View>
    </View>
  );
}
