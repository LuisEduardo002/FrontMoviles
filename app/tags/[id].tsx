import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, Keyboard, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import Button from '../../src/components/Button';
import EventSelect from '../../src/components/EventSelect';
import FormError from '../../src/components/FormError';
import TagFormFields from '../../src/components/TagFormFields';
import VisibilitySegment from '../../src/components/VisibilitySegment';
import { listEvents } from '../../src/api/events';
import { deleteTag, getTag, updateTag } from '../../src/api/tags';
import type { AdminEvent, NfcTag } from '../../src/types';
import { TAG_DEFAULTS, formToUpdateTag, tagToForm, type TagFormValues } from '../../src/utils/tagForm';

/** Detalle + edición + eliminación. Al guardar solo envía lo que cambió. */
export default function TagDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [original, setOriginal] = useState<NfcTag | null>(null);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDeleting, setDeleting] = useState(false);

  const { control, handleSubmit, setError, reset, formState } = useForm<TagFormValues>({
    defaultValues: TAG_DEFAULTS,
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
        const [tag, eventList] = await Promise.all([getTag(id), listEvents().catch(() => [])]);
        setEvents(eventList);
        setOriginal(tag);
        reset(tagToForm(tag));
      } catch (failure) {
        setLoadError((failure as Error).message);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id, reset]);

  const submit = async (values: TagFormValues) => {
    if (!original) return;
    const patch = formToUpdateTag(values, formState.dirtyFields);
    if (Object.keys(patch).length === 0) {
      Alert.alert('Sin cambios', 'No modificaste ningún campo.');
      return;
    }
    try {
      await updateTag(original.id, patch);
      const updated = await getTag(original.id);
      setOriginal(updated);
      reset(tagToForm(updated), { keepErrors: false });
      showMessage('Tag actualizado', 'Los cambios quedaron guardados.');
    } catch (failure) {
      setError('root', { message: (failure as Error).message });
    }
  };

  const confirmDelete = () => {
    if (!original) return;
    const message = `¿Eliminar el tag ${original.code}? Esta acción no se puede deshacer.`;
    if (Platform.OS === 'web') {
      if (globalThis.confirm(message)) void remove();
      return;
    }
    Alert.alert('Eliminar tag', message, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => void remove() },
    ]);
  };

  const remove = async () => {
    if (!original) return;
    try {
      setDeleting(true);
      await deleteTag(original.id);
      setDeleting(false);
      showMessage('Tag eliminado', 'El tag se eliminó correctamente.', () => router.back());
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
        <FormError message={loadError ?? 'Tag no encontrado.'} />
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
          <Text className="text-2xl font-bold text-white">{original.code}</Text>
          <Text className="text-xs text-neutral-400">id {original.id}</Text>
        </View>

        <TagFormFields control={control} />

        <Controller
          control={control}
          name="isHidden"
          render={({ field: { value, onChange } }) => (
            <VisibilitySegment value={value} onChange={onChange} />
          )}
        />
        <Controller
          control={control}
          name="eventId"
          render={({ field: { value, onChange } }) => (
            <EventSelect events={events} value={value} onChange={onChange} />
          )}
        />

        <FormError message={formState.errors.root?.message} />
        <Button
          text={formState.isSubmitting ? 'Guardando…' : 'Guardar cambios'}
          onPress={handleSubmit(submit)}
          disabled={formState.isSubmitting || isDeleting}
        />
        <Button
          text={isDeleting ? 'Eliminando…' : 'Eliminar tag'}
          onPress={confirmDelete}
          disabled={formState.isSubmitting || isDeleting}
          secondary
        />
      </ScrollView>
    </Pressable>
  );
}
