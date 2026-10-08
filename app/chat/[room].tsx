import { useLocalSearchParams } from 'expo-router';
import ChatRoom from '@/components/chat/ChatRoom';

export default function ChatRoomRoute() {
  const { room, name } = useLocalSearchParams<{ room: string; name?: string }>();
  return <ChatRoom room={room} name={name} />;
}
