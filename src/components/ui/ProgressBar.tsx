import { View } from 'react-native';
import { ProgressBarToken } from '@/theme/Token';
import { Caption } from '@/components/ui/Typography';

/** "3 de 5 tags" con su barra: cuánto le falta al jugador en el evento. */
export default function ProgressBar({ found, total }: { found: number; total: number }) {
  const ratio = total === 0 ? 0 : found / total;
  return (
    <View className={ProgressBarToken.container}>
      <View className={ProgressBarToken.track}>
        <View className={ProgressBarToken.fill} style={{ width: `${ratio * 100}%` }} />
      </View>
      <Caption>
        {found} de {total} tags encontrados
      </Caption>
    </View>
  );
}
