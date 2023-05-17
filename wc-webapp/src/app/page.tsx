import Chat from "@/components/chat/page";
import socket from "@/helpers/socket";

export default function Home() {
  return <Chat socket={socket} />;
}
