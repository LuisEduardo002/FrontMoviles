import { useLocalSearchParams } from 'expo-router';
import TagEditor from '@/components/tags/TagEditor';

export default function TagRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <TagEditor id={id} />;
}
