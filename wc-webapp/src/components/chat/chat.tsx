"use client";

import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import generateName from "./name";
import useConversation from "./useConversation";
import Message from "./message";

type ChatProps = {
  socket: Socket;
};

export default function Chat({ socket }: ChatProps) {
  const room = 1;
  const [user, setUser] = useState<string>(generateName());
  const [message, setMessage] = useState<string>("");
  const { conversation, sendMessage } = useConversation({
    user,
    room,
    socket,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target?.value);
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    sendMessage(message);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="h-full p-4">
        <p className="text-xl text-neutral-300 mb-1"># dev-channel</p>
        <div className="h-full py-2">
          <div className="border border-neutral-700 h-full flex flex-col">
            {conversation.map(({ type, message, user }, index) => (
              <Message
                key={`message-${index}`}
                type={type}
                message={message}
                user={user}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 mt-2">
        <input
          value={message}
          onChange={handleChange}
          onKeyDown={handleEnter}
          className="w-full p-3 bg-transparent border dark:border-neutral-700 outline-none dark:text-neutral-300 text-sm"
        />
      </div>
    </div>
  );
}
