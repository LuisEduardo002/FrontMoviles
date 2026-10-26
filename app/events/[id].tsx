import { useLocalSearchParams } from 'expo-router';
import EventDetail from '@/components/events/EventDetail';

export default function EventRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EventDetail id={id} />;
}
