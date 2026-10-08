import { useEffect, useRef } from 'react';
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
      Animated.timing(offset, { toValue, duration: 50, useNativeDriver: Platform.OS !== 'web' });
    Animated.sequence([step(-6), step(6), step(-4), step(4), step(0)]).start();
  }, [trigger, offset]);

  return offset;
}
