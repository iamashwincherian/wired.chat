"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useConversation } from "./conversation-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Conversation } from "@/services/conversation";

export default function RecentConversations() {
  const { conversations = [], isLoading } = useConversation();
  const router = useRouter();

  const openConversation = (conversation: Conversation) => {
    router.push(`/chats/${conversation.id}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-3 p-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {conversations?.map((conversation) => (
        <div
          key={conversation.id}
          className={`flex items-center space-x-3 p-3 cursor-pointer hover:bg-muted transition-colors`}
          onClick={() => openConversation(conversation)}
        >
          <Avatar>
            <AvatarImage
              src={conversation.displayImage}
              alt={conversation.displayName}
            />
            <AvatarFallback>
              {conversation.displayName.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {conversation.displayName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {conversation.type === "channel"
                ? "Channel"
                : `Status: ${conversation.status || "offline"}`}
            </p>
          </div>
          {conversation.status === "online" && (
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          )}
        </div>
      ))}
      {!conversations.length && (
        <div className="text-center py-4 text-stone-300">
          No recent conversations
        </div>
      )}
    </div>
  );
}
