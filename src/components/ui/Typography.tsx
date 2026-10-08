import type { PropsWithChildren } from 'react';
import { Text } from 'react-native';

/**
 * Textos de la escala tipográfica (dict_style.md §1.2). Los títulos usan la
 * fuente "Data" (Orbitron); el resto, Inter.
 */

type TextProps = PropsWithChildren<{ className?: string; numberOfLines?: number }>;

const HEADING = {
  display: 'font-data-black text-display',
  h1: 'font-data text-h1',
  h2: 'font-data text-h2',
  h3: 'font-body-semibold text-h3',
} as const;

export function Heading({
  level = 'h1',
  className,
  numberOfLines,
  children,
}: TextProps & { level?: keyof typeof HEADING }) {
  return (
    <Text numberOfLines={numberOfLines} className={`${HEADING[level]} text-ink ${className ?? ''}`}>
      {children}
    </Text>
  );
}

/** Texto de lectura. `muted` baja el contraste para descripciones. */
export function Body({ muted, className, numberOfLines, children }: TextProps & { muted?: boolean }) {
  return (
    <Text
      numberOfLines={numberOfLines}
      className={`font-body text-body ${muted ? 'text-ink/70' : 'text-ink'} ${className ?? ''}`}>
      {children}
    </Text>
  );
}

/** Metadatos: fechas, lugares, contadores. */
export function Caption({ className, numberOfLines, children }: TextProps) {
  return (
    <Text numberOfLines={numberOfLines} className={`font-body text-caption text-ink/60 ${className ?? ''}`}>
      {children}
    </Text>
  );
}
