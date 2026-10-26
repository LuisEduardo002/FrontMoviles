import { Stack } from 'expo-router';
import Button from '@/components/ui/Button';
import Notice from '@/components/ui/Notice';
import { DangerZone, ErrorScreen, FormScreen, LoadingScreen } from '@/components/ui/Screen';
import UserForm from '@/components/users/UserForm';
import { useUserEditor } from '@/hooks/useUserEditor';

/** Detalle editable de un usuario. La lógica vive en `useUserEditor`. */
export default function UserEditor({ id }: { id: string }) {
  const editor = useUserEditor(id);

  if (editor.isLoading) return <LoadingScreen />;
  if (editor.loadError || !editor.user) {
    return <ErrorScreen message={editor.loadError ?? 'Usuario no encontrado.'} />;
  }

  const busy = editor.isSubmitting || editor.isDeleting;

  return (
    <FormScreen>
      <Stack.Screen options={{ title: editor.user.nickname }} />
      <UserForm control={editor.control} mode="edit" />

      <Notice message={editor.error} />
      {editor.saved && <Notice tone="success" message="Cambios guardados." />}
      <Button
        text={editor.isSubmitting ? 'Guardando…' : 'Guardar cambios'}
        onPress={editor.save}
        disabled={!editor.isDirty || busy}
      />

      {/* Un admin no puede borrarse a sí mismo desde aquí */}
      {!editor.isMe && (
        <DangerZone
          description="Se borran la cuenta y todo su historial de escaneos."
          buttonText={editor.isDeleting ? 'Eliminando…' : 'Eliminar usuario'}
          onPress={() => void editor.remove()}
          disabled={busy}
        />
      )}
    </FormScreen>
  );
}
