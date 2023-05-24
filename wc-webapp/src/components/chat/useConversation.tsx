import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

type Conversation = {
  message: string;
  type: "others" | "mine" | "mod" | string;
  user?: string;
};

type HookProps = {
  user: string;
  room: number;
  socket: Socket;
};

export default function useConversation({
  user: chatUser,
  room,
  socket,
}: HookProps) {
  const [conversation, setConversation] = useState<Conversation[]>([]);

  const sendMessage = (msg: string) => {
    socket.emit("message", {
      user: chatUser,
      room,
      message: msg,
    });
  };

  const onReceiveMessage = ({ message, user }: Conversation) => {
    setConversation((prevConversation) => [
      ...prevConversation,
      {
        message,
        user: user,
        type: user === chatUser ? "mine" : "others",
      },
    ]);
  };

  const onReceiveModMessage = ({ user }: Conversation) => {
    setConversation((prevConversation) => [
      ...prevConversation,
      {
        message: `${user} has joined the room`,
        type: "mod",
        user,
      },
    ]);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("chatUser", chatUser);
      socket.emit("chatroom-join", { user: chatUser, room });
    });
    socket.on("chatroom-mod", onReceiveModMessage);
    socket.on("message", onReceiveMessage);

    return () => {
      socket.disconnect();
      socket.off("chatroom-join");
      socket.off("chatroom-mod");
      socket.off("chatroom-message");
    };
  }, []);

  return { conversation, sendMessage };
}
