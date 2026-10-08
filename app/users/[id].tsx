import { useLocalSearchParams } from 'expo-router';
import UserEditor from '@/components/users/UserEditor';

export default function UserRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <UserEditor id={id} />;
}
