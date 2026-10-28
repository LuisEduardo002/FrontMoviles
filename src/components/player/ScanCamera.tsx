import { CameraView } from 'expo-camera';
import { Text, View } from 'react-native';
import Button from '@/components/ui/Button';
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
    <View className="flex-1 bg-canvas">
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={({ data }) => onQrScanned(data)}
      />
      <View pointerEvents="box-none" className="absolute inset-0 items-center justify-center gap-4 p-4">
        <View className="h-[240px] w-[240px] rounded-md border-2 border-primary" style={{ boxShadow: glow.primary }} />
        <Text className="rounded-full bg-canvas/80 px-3 py-2 font-body-semibold text-body text-ink">
          {isSubmitting ? 'Validando tu ubicación…' : 'Apunta al QR de la etiqueta'}
        </Text>
      </View>
      <View className="absolute bottom-4 left-3 right-3">
        <Button text="Cancelar" variant="secondary" onPress={onCancel} disabled={isSubmitting} />
      </View>
    </View>
  );
}
