import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, Keyboard, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import Button from '../../src/components/Button';
import Field from '../../src/components/Field';
import FormError from '../../src/components/FormError';
import { deleteEvent, getEvent, updateEvent } from '../../src/api/events';
import type { AdminEvent, UpdateEventDto } from '../../src/types';
import { DATE_RE } from '../../src/utils/format';

type EventForm = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

/**
 * Detalle + edición + eliminación de un evento.
 * Precarga los datos y al guardar solo envía lo que cambió.
 */
export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [original, setOriginal] = useState<AdminEvent | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDeleting, setDeleting] = useState(false);

  const { control, handleSubmit, setError, reset, getValues, formState } = useForm<EventForm>({
    defaultValues: { name: '', description: '', startDate: '', endDate: '', isActive: true },
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const event = await getEvent(id);
        setOriginal(event);
        reset({
          name: event.name,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
          isActive: event.isActive,
        });
      } catch (failure) {
        setLoadError((failure as Error).message);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id, reset]);

  const submit = async (values: EventForm) => {
    if (!original) return;
    const patch: UpdateEventDto = {};
    if (formState.dirtyFields.name) patch.name = values.name.trim();
    if (formState.dirtyFields.description) patch.description = values.description.trim();
    if (formState.dirtyFields.startDate) patch.startDate = values.startDate.trim();
    if (formState.dirtyFields.endDate) patch.endDate = values.endDate.trim();
    if (formState.dirtyFields.isActive) patch.isActive = values.isActive;

    if (Object.keys(patch).length === 0) {
      Alert.alert('Sin cambios', 'No modificaste ningún campo.');
      return;
    }

    try {
      const updated = await updateEvent(original.id, patch);
      setOriginal(updated);
      reset(
        {
          name: updated.name,
          description: updated.description,
          startDate: updated.startDate,
          endDate: updated.endDate,
          isActive: updated.isActive,
        },
        { keepErrors: false },
      );
      Alert.alert('Evento actualizado', 'Los cambios quedaron guardados.');
    } catch (failure) {
      setError('root', { message: (failure as Error).message });
    }
  };

  const confirmDelete = () => {
    if (!original) return;
    Alert.alert(
      'Eliminar evento',
      `¿Eliminar "${original.name}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => void remove() },
      ],
    );
  };

  const remove = async () => {
    if (!original) return;
    try {
      setDeleting(true);
      await deleteEvent(original.id);
      Alert.alert('Evento eliminado', '', [{ text: 'OK', onPress: () => router.back() }]);
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
        <FormError message={loadError ?? 'Evento no encontrado.'} />
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
          <Text className="text-2xl font-bold text-white">{original.name}</Text>
          <Text className="text-xs text-neutral-400">id {original.id}</Text>
        </View>

        <Field
          control={control}
          name="name"
          label="Nombre"
          placeholder="Festival Centro 2026"
          rules={{
            required: 'El nombre es obligatorio',
            maxLength: { value: 80, message: 'Máximo 80 caracteres' },
          }}
        />
        <Field
          control={control}
          name="description"
          label="Descripción"
          placeholder="Rally de escaneos por el centro histórico"
          multiline
          numberOfLines={3}
          rules={{
            required: 'La descripción es obligatoria',
            maxLength: { value: 500, message: 'Máximo 500 caracteres' },
          }}
        />
        <Field
          control={control}
          name="startDate"
          label="Fecha de inicio (AAAA-MM-DD)"
          placeholder="2026-09-20"
          rules={{
            required: 'La fecha de inicio es obligatoria',
            pattern: { value: DATE_RE, message: 'Usa el formato AAAA-MM-DD' },
            maxLength: { value: 10, message: 'Máximo 10 caracteres' },
          }}
        />
        <Field
          control={control}
          name="endDate"
          label="Fecha de fin (AAAA-MM-DD)"
          placeholder="2026-09-22"
          rules={{
            required: 'La fecha de fin es obligatoria',
            pattern: { value: DATE_RE, message: 'Usa el formato AAAA-MM-DD' },
            maxLength: { value: 10, message: 'Máximo 10 caracteres' },
            validate: (value) =>
              value >= getValues('startDate') || 'La fecha de fin no puede ser anterior al inicio',
          }}
        />

        <Controller
          control={control}
          name="isActive"
          render={({ field: { value, onChange } }) => (
            <View className="flex-row items-center justify-between rounded-xl border border-secondary bg-tertiary p-3.5">
              <Text className="font-semibold text-neutral-200">Evento activo</Text>
              <Switch value={value} onValueChange={onChange} />
            </View>
          )}
        />

        <FormError message={formState.errors.root?.message} />

        <Button
          text={formState.isSubmitting ? 'Guardando…' : 'Guardar cambios'}
          onPress={handleSubmit(submit)}
          disabled={formState.isSubmitting || isDeleting}
        />
        <Button
          text={isDeleting ? 'Eliminando…' : 'Eliminar evento'}
          onPress={confirmDelete}
          disabled={formState.isSubmitting || isDeleting}
          secondary
        />
      </ScrollView>
    </Pressable>
  );
}
