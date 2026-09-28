import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { registerScan } from '../../src/api/scans';
import Button from '../../src/components/Button';
import CollectibleCard from '../../src/components/CollectibleCard';
import Field from '../../src/components/Field';
import Notice from '../../src/components/Notice';
import { FormScreen } from '../../src/components/Screen';
import { Body, Caption, Heading } from '../../src/components/Typography';
import { colors, glow } from '../../src/theme/tokens';
import type { ScanResult } from '../../src/types';
import { hapticError, hapticSuccess } from '../../src/utils/haptics';

type Mode = 'idle' | 'camera' | 'manual';

/**
 * El QR puede traer el código solo ("NFC-MAN-001") o dentro de una URL
 * (".../tag/NFC-MAN-001"): en los dos casos cuenta el último tramo.
 */
function codeFromQr(data: string): string {
  const parts = data.trim().split('/').filter(Boolean);
  return (parts[parts.length - 1] ?? '').toUpperCase();
}

/** La posición del jugador al escanear: el servidor mide la distancia al tag. */
async function currentPosition() {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Sin tu ubicación no se puede validar el escaneo. Activa el permiso de ubicación.');
  }
  const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
  return { latitude: coords.latitude, longitude: coords.longitude };
}

/**
 * Registrar un tag encontrado: con la cámara (QR de la etiqueta) o
 * escribiendo el código. La ubicación se toma del GPS al enviar y el servidor
 * decide; si rechaza, su mensaje se muestra tal cual ("estás a 230 m...").
 */
export default function Scan() {
  const [mode, setMode] = useState<Mode>('idle');
  const [isSubmitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  // La cámara dispara el mismo QR muchas veces por segundo: se procesa uno
  const handlingScan = useRef(false);
  const { control, handleSubmit, reset } = useForm<{ code: string }>({ defaultValues: { code: '' } });

  const submit = async (code: string) => {
    setSubmitting(true);
    setError(null);
    try {
      const position = await currentPosition();
      const scan = await registerScan({ code, ...position });
      hapticSuccess();
      setResult(scan);
      setMode('idle');
      reset();
    } catch (failure) {
      hapticError();
      setError((failure as Error).message);
      setMode('idle');
    } finally {
      setSubmitting(false);
      handlingScan.current = false;
    }
  };

  const openCamera = async () => {
    setError(null);
    const granted = permission?.granted || (await requestPermission()).granted;
    if (!granted) {
      setError('Sin permiso para usar la cámara. Actívalo en los ajustes o escribe el código.');
      return;
    }
    setMode('camera');
  };

  if (result) {
    return <Reward result={result} onContinue={() => setResult(null)} />;
  }

  if (mode === 'camera') {
    return (
      <View className="flex-1 bg-canvas">
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={({ data }) => {
            if (handlingScan.current) return;
            handlingScan.current = true;
            void submit(codeFromQr(data));
          }}
        />
        <View pointerEvents="box-none" className="absolute inset-0 items-center justify-center gap-4 p-4">
          <View
            className="h-[240px] w-[240px] rounded-md border-2 border-primary"
            style={{ boxShadow: glow.primary }}
          />
          <Text className="rounded-full bg-canvas/80 px-3 py-2 font-body-semibold text-body text-ink">
            {isSubmitting ? 'Validando tu ubicación…' : 'Apunta al QR de la etiqueta'}
          </Text>
        </View>
        <View className="absolute bottom-4 left-3 right-3">
          <Button text="Cancelar" variant="secondary" onPress={() => setMode('idle')} disabled={isSubmitting} />
        </View>
      </View>
    );
  }

  return (
    <FormScreen centered>
      <View className="items-center gap-3 py-4">
        <View
          className="h-[120px] w-[120px] items-center justify-center rounded-full border-2 border-primary bg-surface"
          style={{ boxShadow: glow.primary }}>
          <MaterialDesignIcons name="nfc-search-variant" size={64} color={colors.primary} />
        </View>
        <Heading level="h2" className="text-center">
          ¿Encontraste un tag?
        </Heading>
        <Body muted className="text-center">
          Escanea su QR estando junto a la etiqueta. Tu ubicación se valida al registrarlo.
        </Body>
      </View>

      <Notice message={error} />

      {mode === 'manual' ? (
        <>
          <Field
            control={control}
            name="code"
            label="Código de la etiqueta"
            autoCapitalize="characters"
            placeholder="NFC-MAN-001"
            returnKeyType="send"
            onSubmitEditing={handleSubmit(({ code }) => submit(code.trim().toUpperCase()), hapticError)}
            rules={{ required: 'Escribe el código que ves en la etiqueta' }}
          />
          <Button
            text={isSubmitting ? 'Validando…' : 'Registrar'}
            onPress={handleSubmit(({ code }) => submit(code.trim().toUpperCase()), hapticError)}
            disabled={isSubmitting}
          />
          <Button text="Usar la cámara" variant="secondary" icon="qrcode-scan" onPress={() => void openCamera()} />
        </>
      ) : (
        <>
          <Button text="Escanear QR" icon="qrcode-scan" onPress={() => void openCamera()} disabled={isSubmitting} />
          <Button
            text="Escribir el código"
            icon="keyboard-outline"
            variant="secondary"
            onPress={() => setMode('manual')}
          />
        </>
      )}
    </FormScreen>
  );
}

/** La recompensa: la carta ganada, los puntos y a dónde seguir. */
function Reward({ result, onContinue }: { result: ScanResult; onContinue: () => void }) {
  const { tag } = result;

  return (
    <FormScreen centered>
      <View className="items-center gap-1">
        <Caption>¡Tag encontrado!</Caption>
        <Text
          className="font-data-black text-display text-primary"
          style={{ textShadowColor: colors.primary, textShadowRadius: 16 }}>
          +{result.pointsEarned}
        </Text>
        <Body muted>Ahora tienes {result.totalPoints} puntos</Body>
      </View>

      <View className="w-[220px] self-center">
        <CollectibleCard
          title={tag.cardTitle ?? tag.name}
          subtitle={tag.name}
          imageUrl={tag.cardImageUrl}
          points={result.pointsEarned}
        />
      </View>

      {!!tag.cardFunFact && (
        <View className="gap-1 rounded-md bg-surface p-3">
          <Text className="font-body-semibold text-body text-secondary">Dato curioso</Text>
          <Body>{tag.cardFunFact}</Body>
        </View>
      )}

      <Button text="Seguir cazando" icon="qrcode-scan" onPress={onContinue} />
      <Button
        text="Ver mi álbum"
        icon="cards-outline"
        variant="secondary"
        onPress={() => {
          onContinue();
          router.navigate('/(tabs)/perfil');
        }}
      />
    </FormScreen>
  );
}
