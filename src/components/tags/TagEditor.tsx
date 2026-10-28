import { Stack } from 'expo-router';
import TagForm from '@/components/tags/TagForm';
import TagQr from '@/components/tags/TagQr';
import Button from '@/components/ui/Button';
import Notice from '@/components/ui/Notice';
import { DangerZone, ErrorScreen, FormScreen, LoadingScreen } from '@/components/ui/Screen';
import { useTagEditor } from '@/hooks/useTagEditor';

/** Detalle editable de un tag, con su QR imprimible. La lógica vive en `useTagEditor`. */
export default function TagEditor({ id }: { id: string }) {
  const editor = useTagEditor(id);

  if (editor.isLoading) return <LoadingScreen />;
  if (editor.loadError || !editor.tag) return <ErrorScreen message={editor.loadError ?? 'Tag no encontrado.'} />;

  const busy = editor.isSubmitting || editor.isDeleting;

  return (
    <FormScreen>
      <Stack.Screen options={{ title: editor.tag.code }} />
      <TagQr code={editor.tag.code} />
      <TagForm control={editor.control} events={editor.events} />

      <Notice message={editor.error} />
      {editor.saved && <Notice tone="success" message="Cambios guardados." />}
      <Button
        text={editor.isSubmitting ? 'Guardando…' : 'Guardar cambios'}
        onPress={editor.save}
        disabled={!editor.isDirty || busy}
      />

      <DangerZone
        description="Al eliminar el tag también se borran sus escaneos."
        buttonText={editor.isDeleting ? 'Eliminando…' : 'Eliminar tag'}
        onPress={() => void editor.remove()}
        disabled={busy}
      />
    </FormScreen>
  );
}
