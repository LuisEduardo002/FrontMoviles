import { useEffect, useRef } from 'react';
import { FieldToken } from '@/theme/Token';
import { Animated, Platform } from 'react-native';

/**
 * Sacudida horizontal (dict_style.md §3.2: 0 → -6 → 6 → -4 → 4 → 0 en
 * ~250 ms) cada vez que `trigger` pasa a tener valor, por ejemplo al aparecer
 * un error. Devuelve el valor animado para `transform: [{ translateX }]`.
 */
export function useShake(trigger?: string) {
  const offset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!trigger) return;
    const step = (toValue: number) =>
      Animated.timing(offset, { toValue, duration: FieldToken.shake.stepMs, useNativeDriver: Platform.OS !== 'web' });
    Animated.sequence(FieldToken.shake.steps.map(step)).start();
  }, [trigger, offset]);

  return offset;
}
