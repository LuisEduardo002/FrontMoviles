import { Text } from 'react-native';

/** Error del formulario completo (mensaje del servidor). Ver ESTILOS.md. */
export default function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Text className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-center text-red-200">
      {message}
    </Text>
  );
}
