import type { PropsWithChildren } from 'react';
import { TypographyToken } from '@/theme/Token';
import { Text } from 'react-native';

/**
 * Textos de la escala tipográfica (dict_style.md §1.2). Los títulos usan la
 * fuente "Data" (Orbitron); el resto, Inter.
 */

type TextProps = PropsWithChildren<{ className?: string; numberOfLines?: number }>;

export function Heading({
  level = 'h1',
  className,
  numberOfLines,
  children,
}: TextProps & { level?: keyof typeof TypographyToken.heading }) {
  return (
    <Text numberOfLines={numberOfLines} className={`${TypographyToken.heading[level]} ${TypographyToken.headingColor} ${className ?? ''}`}>
      {children}
    </Text>
  );
}

/** Texto de lectura. `muted` baja el contraste para descripciones. */
export function Body({ muted, className, numberOfLines, children }: TextProps & { muted?: boolean }) {
  return (
    <Text
      numberOfLines={numberOfLines}
      className={`${TypographyToken.body} ${TypographyToken.bodyColor[muted ? 'muted' : 'default']} ${className ?? ''}`}>
      {children}
    </Text>
  );
}

/** Metadatos: fechas, lugares, contadores. */
export function Caption({ className, numberOfLines, children }: TextProps) {
  return (
    <Text numberOfLines={numberOfLines} className={`${TypographyToken.caption} ${className ?? ''}`}>
      {children}
    </Text>
  );
}
