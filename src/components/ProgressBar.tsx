import { View } from 'react-native';
import { Caption } from './Typography';

/** "3 de 5 tags" con su barra: cuánto le falta al jugador en el evento. */
export default function ProgressBar({ found, total }: { found: number; total: number }) {
  const ratio = total === 0 ? 0 : found / total;
  return (
    <View className="gap-1">
      <View className="h-[6px] overflow-hidden rounded-full bg-disabled">
        <View className="h-full rounded-full bg-primary" style={{ width: `${ratio * 100}%` }} />
      </View>
      <Caption>
        {found} de {total} tags encontrados
      </Caption>
    </View>
  );
}
