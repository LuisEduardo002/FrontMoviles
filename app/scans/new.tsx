import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, Keyboard, Pressable, ScrollView, Text, View } from 'react-native';
import Button from '../../src/components/Button';
import Field from '../../src/components/Field';
import FormError from '../../src/components/FormError';
import UserSelect from '../../src/components/UserSelect';
import { createScan } from '../../src/api/scans';
import { listUsers } from '../../src/api/users';
import type { AdminUser } from '../../src/types';
import { DATE_RE, todayIsoDate } from '../../src/utils/format';

type ScanForm = {
  userId: string;
  tagCode: string;
  location: string;
  pointsEarned: string;
  scannedAt: string;
};

/**
 * Registrar un escaneo en la bitácora (qué usuario, qué tag, dónde,
 * cuántos puntos y cuándo). Con confirmación al guardar.
 */
export default function NewScan() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const { control, handleSubmit, setError, formState } = useForm<ScanForm>({
    defaultValues: {
      userId: '',
      tagCode: '',
      location: '',
      pointsEarned: '10',
      scannedAt: todayIsoDate(),
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        setUsers(await listUsers());
      } catch {
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    void load();
  }, []);

  const submit = async (values: ScanForm) => {
    if (!values.userId) {
      setError('userId', { message: 'Elige el usuario que escaneó' });
      return;
    }
    try {
      await createScan({
        userId: values.userId,
        tagCode: values.tagCode.trim().toUpperCase(),
        location: values.location.trim(),
        pointsEarned: Number(values.pointsEarned),
        scannedAt: `${values.scannedAt.trim()}T12:00:00.000Z`,
      });
      Alert.alert('Escaneo registrado', `${values.tagCode} quedó en el historial.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (failure) {
      setError('root', { message: (failure as Error).message });
    }
  };

  if (loadingUsers) {
    return (
      <View className="flex-1 items-center justify-center bg-base">
        <ActivityIndicator color="#fff" />
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
          <Text className="text-2xl font-bold text-white">Nuevo escaneo</Text>
          <Text className="text-neutral-400">Registra una interacción NFC exitosa.</Text>
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
          rules={{
            required: 'La fecha es obligatoria',
            pattern: { value: DATE_RE, message: 'Usa el formato AAAA-MM-DD' },
            maxLength: { value: 10, message: 'Máximo 10 caracteres' },
          }}
        />

        <FormError message={formState.errors.root?.message} />

        <Button
          text={formState.isSubmitting ? 'Guardando…' : 'Guardar escaneo'}
          onPress={handleSubmit(submit)}
          disabled={formState.isSubmitting}
        />
      </ScrollView>
    </Pressable>
  );
}
