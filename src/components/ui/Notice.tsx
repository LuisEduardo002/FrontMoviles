import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { Text, View } from 'react-native';
import { NoticeToken } from '@/theme/Token';
import { colors } from '@/theme/tokens';

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
      className={`${NoticeToken.container} ${NoticeToken.tone[tone].box}`}>
      <MaterialDesignIcons
        name={isError ? 'alert-circle' : 'check-circle'}
        size={NoticeToken.iconSize}
        color={isError ? colors.danger : colors.primary}
      />
      <Text className={`${NoticeToken.text} ${NoticeToken.tone[tone].text}`}>
        {message}
      </Text>
    </View>
  );
}
