"use client";

import { useEffect, useRef } from "react";

import { useConversation } from "./conversation-context";
import { useMessages } from "./messages-context";
import getUserClient from "@/lib/get-user-client";
import { GalleryVerticalEnd, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddContactModal from "@/components/modals/add-contact";

export default function Messages() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading: isMessagesLoading } = useMessages();
  const {
    activeConversation,
    conversations,
    isLoading: isConversationsLoading,
  } = useConversation();
  const user = getUserClient();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (activeConversation && isMessagesLoading) {
    return <div>Loading messages...</div>;
  }
  if (!activeConversation) {
    return (
      <div className="space-y-4 h-full">
        <div className="h-full w-full flex flex-col justify-center items-center gap-4">
          <GalleryVerticalEnd className="size-12 text-stone-400" />

          <p className="text-4xl font-bold text-stone-400">Wired.Chat</p>
          <p className="text-stone-400 text-center text-[14px] mx-6">
            Stay connected with your colleagues and friends. Start your first
            conversation by adding a contact or joining a group.
          </p>

          {!isConversationsLoading && !conversations.length && (
            <AddContactModal
              trigger={
                <Button size={"sm"}>
                  <Plus />
                  Add Contact
                </Button>
              }
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {activeConversation && messages.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm">
          Send a message to start chatting with{" "}
          {activeConversation?.displayName}
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
