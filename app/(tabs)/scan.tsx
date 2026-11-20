import { useLocalSearchParams } from 'expo-router';
import Scan from '@/components/player/Scan';

export default function ScanRoute() {
  const { mode, t } = useLocalSearchParams<{ mode?: string; t?: string }>();
  return <Scan initialMode={mode} triggerKey={t} />;
}
