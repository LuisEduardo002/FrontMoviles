import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, Keyboard, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import Button from '../../src/components/Button';
import Field from '../../src/components/Field';
import FormError from '../../src/components/FormError';
import UserSelect from '../../src/components/UserSelect';
import { deleteScan, getScan, listScanUsers, updateScan } from '../../src/api/scans';
import type { AdminUser, ScanHistory, UpdateScanDto } from '../../src/types';
import { DATE_RE, formatDateTime } from '../../src/utils/format';

type ScanForm = {
  userId: string;
  tagCode: string;
  location: string;
  pointsEarned: string;
  scannedAt: string;
};

/**
 * Detalle + edición + eliminación de un escaneo del historial.
 * Precarga los datos y al guardar solo envía lo que cambió.
 */
export default function ScanDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [original, setOriginal] = useState<ScanHistory | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDeleting, setDeleting] = useState(false);

  const { control, handleSubmit, setError, reset, formState } = useForm<ScanForm>({
    defaultValues: { userId: '', tagCode: '', location: '', pointsEarned: '0', scannedAt: '' },
  });

  const showMessage = (title: string, message: string, onClose?: () => void) => {
    if (Platform.OS === 'web') {
      globalThis.alert(`${title}\n\n${message}`);
      onClose?.();
      return;
    }
    Alert.alert(title, message, [{ text: 'OK', onPress: onClose }]);
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const [scan, userList] = await Promise.all([getScan(id), listScanUsers()]);
        setUsers(userList);
        setOriginal(scan);
        reset({
          userId: scan.userId,
          tagCode: scan.tagCode,
          location: scan.location,
          pointsEarned: String(scan.pointsEarned),
          scannedAt: scan.scannedAt.slice(0, 10),
        });
      } catch (failure) {
        setLoadError((failure as Error).message);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id, reset]);

  const submit = async (values: ScanForm) => {
    if (!original) return;
    const patch: UpdateScanDto = {};
    if (formState.dirtyFields.userId) patch.userId = values.userId;
    if (formState.dirtyFields.tagCode) patch.tagCode = values.tagCode.trim().toUpperCase();
    if (formState.dirtyFields.location) patch.location = values.location.trim();
    if (formState.dirtyFields.pointsEarned) patch.pointsEarned = Number(values.pointsEarned);
    if (formState.dirtyFields.scannedAt) patch.scannedAt = `${values.scannedAt.trim()}T12:00:00.000Z`;

    if (Object.keys(patch).length === 0) {
      Alert.alert('Sin cambios', 'No modificaste ningún campo.');
      return;
    }

    try {
      const updated = await updateScan(original.id, patch);
      setOriginal(updated);
      reset(
        {
          userId: updated.userId,
          tagCode: updated.tagCode,
          location: updated.location,
          pointsEarned: String(updated.pointsEarned),
          scannedAt: updated.scannedAt.slice(0, 10),
        },
        { keepErrors: false },
      );
      showMessage('Escaneo actualizado', 'Los cambios quedaron guardados.');
    } catch (failure) {
      setError('root', { message: (failure as Error).message });
    }
  };

  const confirmDelete = () => {
    if (!original) return;
    const message = `¿Eliminar el registro de ${original.tagCode}? Esta acción no se puede deshacer.`;

    if (Platform.OS === 'web') {
      if (globalThis.confirm(message)) void remove();
      return;
    }

    Alert.alert('Eliminar escaneo', message, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => void remove() },
    ]);
  };

  const remove = async () => {
    if (!original) return;
    try {
      setDeleting(true);
      await deleteScan(original.id);
      setDeleting(false);
      showMessage('Escaneo eliminado', 'El escaneo se eliminó correctamente.', () => router.back());
    } catch (failure) {
      setDeleting(false);
      setError('root', { message: (failure as Error).message });
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-base">
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  if (loadError || !original) {
    return (
      <View className="flex-1 justify-center gap-5 bg-base p-6">
        <Text className="text-center text-xl font-bold text-white">No se pudo cargar</Text>
        <FormError message={loadError ?? 'Escaneo no encontrado.'} />
        <Button text="Volver" onPress={() => router.back()} secondary />
      </View>
    );
  }

  return (
    <Pressable className="flex-1 bg-base" onPress={Keyboard.dismiss}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 p-6"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
        <View className="gap-1">
          <Text className="text-2xl font-bold text-white">{original.tagCode}</Text>
          <Text className="text-xs text-neutral-400">
            {formatDateTime(original.scannedAt)} · id {original.id}
          </Text>
        </View>

        <Controller
          control={control}
          name="userId"
          rules={{ required: 'Elige el usuario que escaneó' }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <UserSelect users={users} value={value} onChange={onChange} error={error?.message} />
          )}
        />
        <Field
          control={control}
          name="tagCode"
          label="Tag NFC"
          autoCapitalize="characters"
          placeholder="TAG-PLAZA-001"
          rules={{
            required: 'El tag es obligatorio',
            maxLength: { value: 40, message: 'Máximo 40 caracteres' },
          }}
        />
        <Field
          control={control}
          name="location"
          label="Ubicación exacta"
          placeholder="Plaza central, frente a la fuente"
          rules={{
            required: 'La ubicación es obligatoria',
            maxLength: { value: 120, message: 'Máximo 120 caracteres' },
          }}
        />
        <Field
          control={control}
          name="pointsEarned"
          label="Puntos ganados"
          keyboardType="numeric"
          placeholder="10"
          rules={{
            required: 'Los puntos son obligatorios',
            validate: (value) => {
              const n = Number(value);
              if (!Number.isInteger(n) || n < 1) return 'Debe ser un entero mayor a 0';
              if (n > 1000) return 'Máximo 1000';
              return true;
            },
          }}
        />
        <Field
          control={control}
          name="scannedAt"
          label="Fecha del escaneo (AAAA-MM-DD)"
          placeholder="2026-09-15"
          format="date"
          rules={{
            required: 'La fecha es obligatoria',
            pattern: { value: DATE_RE, message: 'Usa el formato AAAA-MM-DD' },
            maxLength: { value: 10, message: 'Máximo 10 caracteres' },
          }}
        />

        <FormError message={formState.errors.root?.message} />

        <Button
          text={formState.isSubmitting ? 'Guardando…' : 'Guardar cambios'}
          onPress={handleSubmit(submit)}
          disabled={formState.isSubmitting || isDeleting}
        />
        <Button
          text={isDeleting ? 'Eliminando…' : 'Eliminar escaneo'}
          onPress={confirmDelete}
          disabled={formState.isSubmitting || isDeleting}
          secondary
        />
      </ScrollView>
    </Pressable>
  );
}
