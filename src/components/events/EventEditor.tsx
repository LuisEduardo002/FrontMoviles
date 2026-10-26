import { Stack } from 'expo-router';
import EventForm from '@/components/events/EventForm';
import Button from '@/components/ui/Button';
import Notice from '@/components/ui/Notice';
import { DangerZone, ErrorScreen, FormScreen, LoadingScreen } from '@/components/ui/Screen';
import { useEventEditor } from '@/hooks/useEventEditor';

/** Detalle editable de un evento (admin). La lógica vive en `useEventEditor`. */
export default function EventEditor({ id }: { id: string }) {
  const editor = useEventEditor(id);

  if (editor.isLoading) return <LoadingScreen />;
  if (editor.loadError || !editor.event) {
    return <ErrorScreen message={editor.loadError ?? 'Evento no encontrado.'} />;
  }

  const busy = editor.isSubmitting || editor.isDeleting;

  return (
    <FormScreen>
      <Stack.Screen options={{ title: editor.event.name }} />
      <EventForm control={editor.control} getStartDate={editor.getStartDate} />

      <Notice message={editor.error} />
      {editor.saved && <Notice tone="success" message="Cambios guardados." />}
      <Button
        text={editor.isSubmitting ? 'Guardando…' : 'Guardar cambios'}
        onPress={editor.save}
        disabled={!editor.isDirty || busy}
      />

      <DangerZone
        description="Eliminar el evento no borra sus tags: quedan sin evento asignado."
        buttonText={editor.isDeleting ? 'Eliminando…' : 'Eliminar evento'}
        onPress={() => void editor.remove()}
        disabled={busy}
      />
    </FormScreen>
  );
}
