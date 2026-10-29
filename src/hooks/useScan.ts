import { useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useForm } from 'react-hook-form';
import { registerScan } from '@/api/scans';
import type { ScanResult } from '@/types';
import { hapticError, hapticSuccess } from '@/utils/haptics';
import { cancelNfcRead, nfcStatus, openNfcSettings, readNfcCode, type NfcStatus } from '@/utils/nfc';
import { codeFromQr, currentPosition, PermissionDeniedError, type BlockedPermission } from '@/utils/scan';

export type ScanMode = 'idle' | 'camera' | 'manual' | 'nfc';

/**
 * El flujo de registrar un tag encontrado: acercando el celular a la etiqueta
 * (NFC, solo Android), con la cámara (QR) o escribiendo el código. La
 * ubicación se toma del GPS al enviar y el servidor decide; si rechaza, su
 * mensaje queda en `error` tal cual. Los tres caminos terminan en `submit`.
 */
export function useScan() {
  const [mode, setMode] = useState<ScanMode>('idle');
  const [isSubmitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Permiso que el sistema ya no vuelve a preguntar: se arregla en Ajustes
  const [blocked, setBlocked] = useState<BlockedPermission | null>(null);
  const [nfc, setNfc] = useState<NfcStatus>('unsupported');
  const [permission, requestPermission] = useCameraPermissions();
  // La cámara dispara el mismo QR muchas veces por segundo: se procesa uno
  const handlingScan = useRef(false);
  // Para ignorar el fallo de la lectura NFC que el propio jugador cancela
  const nfcActive = useRef(false);
  const { control, handleSubmit, reset } = useForm<{ code: string }>({ defaultValues: { code: '' } });

  const refreshNfc = async () => setNfc(await nfcStatus());

  useEffect(() => {
    void refreshNfc();
    // Al volver de los ajustes del sistema, el NFC puede haber quedado encendido
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refreshNfc();
    });
    return () => {
      subscription.remove();
      nfcActive.current = false;
      void cancelNfcRead();
    };
  }, []);

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
      if (failure instanceof PermissionDeniedError) setBlocked(failure.permission);
      else setError((failure as Error).message);
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
      setBlocked('camera');
      return;
    }
    setMode('camera');
  };

  /** Espera el sticker; al leerlo, sigue el mismo camino que el QR. */
  const openNfc = async () => {
    setError(null);
    const status = await nfcStatus();
    setNfc(status);
    if (status !== 'ready') return;
    nfcActive.current = true;
    setMode('nfc');
    try {
      const code = await readNfcCode();
      if (!nfcActive.current) return;
      nfcActive.current = false;
      await submit(code);
    } catch (failure) {
      if (!nfcActive.current) return;
      nfcActive.current = false;
      hapticError();
      setError((failure as Error).message);
      setMode('idle');
    }
  };

  const cancel = () => {
    if (nfcActive.current) {
      nfcActive.current = false;
      void cancelNfcRead();
    }
    setMode('idle');
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
    nfc,
    blocked,
    closeBlocked: () => setBlocked(null),
    openNfc,
    openNfcSettings: () => void openNfcSettings(),
    openCamera,
    openManual: () => setMode('manual'),
    cancel,
    onQrScanned,
    control,
    submitCode,
    isSubmitting,
    error,
    result,
    clearResult: () => setResult(null),
  };
}
