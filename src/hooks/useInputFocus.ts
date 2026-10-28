import { useState } from 'react';

/**
 * Si un input tiene el foco, para pintarlo en cian (dict_style.md §3.2).
 * `onFocus` y `onBlur` van al TextInput; si el input necesita hacer algo más
 * al perder el foco (react-hook-form), lo llama después de `onBlur`.
 */
export function useInputFocus() {
  const [isFocused, setFocused] = useState(false);
  return {
    isFocused,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };
}
