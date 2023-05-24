import Chat from "@/components/chat/chat";
import socket from "@/helpers/socket";

export default function Home() {
  return <Chat socket={socket} />;
}
