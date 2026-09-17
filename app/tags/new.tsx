import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Keyboard, Pressable, ScrollView, Text, View } from 'react-native';
import Button from '../../src/components/Button';
import EventSelect from '../../src/components/EventSelect';
import FormError from '../../src/components/FormError';
import TagFormFields from '../../src/components/TagFormFields';
import VisibilitySegment from '../../src/components/VisibilitySegment';
import { listEvents } from '../../src/api/events';
import { createTag } from '../../src/api/tags';
import type { AdminEvent } from '../../src/types';
import { TAG_DEFAULTS, formToCreateTag, type TagFormValues } from '../../src/utils/tagForm';

/** Crear tag NFC. Solo `code`, `name` y `location` son obligatorios. */
export default function NewTag() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const { control, handleSubmit, setError, formState } = useForm<TagFormValues>({
    defaultValues: TAG_DEFAULTS,
  });

  useEffect(() => {
    const load = async () => {
      try {
        setEvents(await listEvents());
      } catch {
        setEvents([]);
      }
    };
    void load();
  }, []);

  const submit = async (values: TagFormValues) => {
    try {
      const created = await createTag(formToCreateTag(values));
      Alert.alert('Tag creado', `${created.code} quedó registrado.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (failure) {
      setError('root', { message: (failure as Error).message });
    }
  };

  return (
    <Pressable className="flex-1 bg-base" onPress={Keyboard.dismiss}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 p-6"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
        <View className="gap-1">
          <Text className="text-2xl font-bold text-white">Nuevo tag</Text>
          <Text className="text-neutral-400">Registra un punto NFC para la cacería.</Text>
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
          text={formState.isSubmitting ? 'Guardando…' : 'Guardar tag'}
          onPress={handleSubmit(submit)}
          disabled={formState.isSubmitting}
        />
      </ScrollView>
    </Pressable>
  );
}
