"use client";

import { useEffect, useRef } from "react";

import { useMessages } from "../messages-context";
import getUserClient from "@/lib/get-user-client";
import { Conversation } from "@/services/conversation";

export default function Messages({
  conversation,
}: {
  conversation: Conversation;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    isLoading: isMessagesLoading,
    fetchMessages,
  } = useMessages();
  const user = getUserClient();

  useEffect(() => {
    fetchMessages(conversation.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (conversation && isMessagesLoading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {conversation && messages.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm">
          Send a message to start chatting with {conversation?.displayName}
        </p>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === user.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`text-sm rounded-lg px-3 py-1.5 max-w-[85%] ${
                message.senderId === user.id
                  ? "bg-muted"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))
      )}
      <div className="mb-[-16px]" ref={messagesEndRef} />
    </div>
  );
}
