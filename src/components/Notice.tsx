import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { Text, View } from 'react-native';
import { colors } from '../theme/tokens';

/**
 * Aviso en línea: el mensaje del servidor cuando algo falla, o la
 * confirmación de que se guardó. Reemplaza a los `Alert`, que no existen en web.
 */
export default function Notice({
  message,
  tone = 'error',
}: {
  message?: string | null;
  tone?: 'error' | 'success';
}) {
  if (!message) return null;
  const isError = tone === 'error';

  return (
    <View
      accessibilityRole="alert"
      className={`flex-row items-center gap-2 rounded-sm border-2 p-3 ${
        isError ? 'border-danger/60 bg-danger/10' : 'border-primary/60 bg-primary/10'
      }`}>
      <MaterialDesignIcons
        name={isError ? 'alert-circle' : 'check-circle'}
        size={20}
        color={isError ? colors.danger : colors.primary}
      />
      <Text className={`flex-1 font-body-medium text-body ${isError ? 'text-danger' : 'text-primary'}`}>
        {message}
      </Text>
    </View>
  );
}
