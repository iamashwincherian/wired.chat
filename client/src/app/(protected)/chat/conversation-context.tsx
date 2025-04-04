"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ApiClient } from "@/lib/api-client";

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  type?: string;
  status?: string;
  displayName: string;
  userId?: string;
}

interface ConversationContextType {
  conversations: Conversation[];
  setConversations: (conversation: Conversation[]) => void;
  activeConversation: Conversation | null;
  setActiveConversation: (conversation: Conversation) => void;
  isLoading: boolean;
}

const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

export function ConversationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchConversations() {
      const response = await ApiClient<Conversation[]>(
        "GET",
        "/conversations",
        null,
        {
          auth: true,
        }
      );

      if (response.success && response.data) {
        setConversations(response.data);
      }
      setIsLoading(false);
    }

    fetchConversations();
  }, []);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        setConversations,
        activeConversation,
        setActiveConversation,
        isLoading,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error(
      "useConversation must be used within a ConversationProvider"
    );
  }
  return context;
}
