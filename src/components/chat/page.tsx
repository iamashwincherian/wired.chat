"use client";

import { useState } from "react";

type conversation = {
  message: string;
  mine: boolean;
};

const defaultConversation = [{ message: "Hey!", mine: false }];

export default function Chat() {
  const [message, setMessage] = useState<string>("");
  const [conversation, setConversation] =
    useState<conversation[]>(defaultConversation);

  const sendMessage = (msg: string) => {
    setConversation([
      ...conversation,
      {
        message: msg,
        mine: true,
      },
    ]);
  };

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
            {conversation.map((item, index) => (
              <div
                key={index}
                className={`border border-neutral-700 w-fit h-fit m-2 px-3 py-1 rounded-md ${
                  item.mine && "self-end"
                }`}
              >
                {item.message}
              </div>
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
