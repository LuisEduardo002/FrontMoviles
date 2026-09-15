import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Keyboard, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import Button from '../../src/components/Button';
import Field from '../../src/components/Field';
import FormError from '../../src/components/FormError';
import { createEvent } from '../../src/api/events';
import { DATE_RE } from '../../src/utils/format';

type EventForm = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

/** Crear evento. Fechas en texto YYYY-MM-DD (sin date-picker nativo). */
export default function NewEvent() {
  const { control, handleSubmit, setError, getValues, formState } = useForm<EventForm>({
    defaultValues: { name: '', description: '', startDate: '', endDate: '', isActive: true },
  });

  const submit = async (values: EventForm) => {
    try {
      await createEvent({
        name: values.name.trim(),
        description: values.description.trim(),
        startDate: values.startDate.trim(),
        endDate: values.endDate.trim(),
        isActive: values.isActive,
      });
      Alert.alert('Evento creado', `${values.name} quedó registrado.`, [
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
          <Text className="text-2xl font-bold text-white">Nuevo evento</Text>
          <Text className="text-neutral-400">Agrupa actividades: festival, temporada o rally.</Text>
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
          text={formState.isSubmitting ? 'Guardando…' : 'Guardar evento'}
          onPress={handleSubmit(submit)}
          disabled={formState.isSubmitting}
        />
      </ScrollView>
    </Pressable>
  );
}
