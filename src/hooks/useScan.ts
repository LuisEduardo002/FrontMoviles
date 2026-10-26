import { useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerScan } from '@/api/scans';
import type { ScanResult } from '@/types';
import { hapticError, hapticSuccess } from '@/utils/haptics';
import { codeFromQr, currentPosition } from '@/utils/scan';

export type ScanMode = 'idle' | 'camera' | 'manual';

/**
 * El flujo de registrar un tag encontrado: con la cámara (QR de la etiqueta)
 * o escribiendo el código. La ubicación se toma del GPS al enviar y el
 * servidor decide; si rechaza, su mensaje queda en `error` tal cual.
 */
export function useScan() {
  const [mode, setMode] = useState<ScanMode>('idle');
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
      reset();
    } catch (failure) {
      hapticError();
      setError((failure as Error).message);
    } finally {
      setMode('idle');
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

  /** Para `onBarcodeScanned` de la cámara. */
  const onQrScanned = (data: string) => {
    if (handlingScan.current) return;
    handlingScan.current = true;
    void submit(codeFromQr(data));
  };

  const submitCode = handleSubmit(({ code }) => submit(code.trim().toUpperCase()), hapticError);

  return {
    mode,
    openCamera,
    openManual: () => setMode('manual'),
    cancel: () => setMode('idle'),
    onQrScanned,
    control,
    submitCode,
    isSubmitting,
    error,
    result,
    clearResult: () => setResult(null),
  };
}
