import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Platform, Pressable, Text, View } from 'react-native';
import Button from '@/components/ui/Button';
import { AlertToken } from '@/theme/Token';
import { colors, glow } from '@/theme/tokens';
import { registerAlertHost, type AlertRequest, type AlertTone } from '@/utils/dialog';
import { hapticError, hapticSuccess } from '@/utils/haptics';

const ICON_COLOR: Record<AlertTone, string> = {
  danger: colors.danger,
  success: colors.primary,
  info: colors.secondary,
};

const GLOW: Record<AlertTone, string> = {
  danger: glow.danger,
  success: glow.primary,
  info: glow.secondary,
};

/**
 * Pinta las alertas de `showAlert` y `confirmDestructive`. Va una sola vez en
 * el layout raíz. Si llegan varias a la vez, salen en orden: una por una.
 */
export default function AlertHost() {
  const [queue, setQueue] = useState<AlertRequest[]>([]);
  const current = queue[0];
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => registerAlertHost((request) => setQueue((pending) => [...pending, request])), []);

  useEffect(() => {
    if (!current) return;
    if (current.tone === 'danger') hapticError();
    if (current.tone === 'success') hapticSuccess();
    scale.setValue(AlertToken.enter.fromScale);
    Animated.timing(scale, {
      toValue: 1,
      duration: AlertToken.enter.durationMs,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [current, scale]);

  const close = (confirmed: boolean) => {
    current?.resolve(confirmed);
    setQueue((pending) => pending.slice(1));
  };

  const tone = current?.tone ?? 'info';
  const style = AlertToken.tone[tone];

  return (
    <Modal
      visible={!!current}
      transparent
      animationType="fade"
      statusBarTranslucent
      // Botón "atrás" de Android: cuenta como cancelar.
      onRequestClose={() => close(false)}>
      {!!current && (
        <View className={AlertToken.overlay}>
          <Pressable className={AlertToken.backdrop} onPress={() => close(false)} accessibilityLabel="Cerrar alerta" />
          {/* NativeWind no estiliza Animated.View: la animación va por fuera y las clases, adentro. */}
          <Animated.View style={[AlertToken.enterWrapper, { transform: [{ scale }] }]}>
            <View
              accessibilityRole="alert"
              accessibilityViewIsModal
              className={`${AlertToken.card} ${style.border}`}
              style={{ boxShadow: GLOW[tone] }}>
              <View className={`${AlertToken.icon} ${style.icon}`}>
                <MaterialDesignIcons name={style.iconName} size={AlertToken.iconSize} color={ICON_COLOR[tone]} />
              </View>
              <Text className={AlertToken.title}>{current.title}</Text>
              <Text className={AlertToken.message}>{current.message}</Text>
              <View className={AlertToken.actions}>
                {!!current.cancelText && (
                  <Button
                    text={current.cancelText}
                    variant="secondary"
                    onPress={() => close(false)}
                    className={AlertToken.button}
                  />
                )}
                <Button
                  text={current.confirmText ?? 'Entendido'}
                  variant={tone === 'danger' ? 'danger' : 'primary'}
                  onPress={() => close(true)}
                  className={AlertToken.button}
                />
              </View>
            </View>
          </Animated.View>
        </View>
      )}
    </Modal>
  );
}
