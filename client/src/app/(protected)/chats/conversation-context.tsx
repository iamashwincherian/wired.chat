"use client";

import { createContext, useContext, useEffect, useState } from "react";
import ConversationService, { Conversation } from "@/services/conversation";

interface ConversationContextType {
  conversations: Conversation[];
  setConversations: (conversation: Conversation[]) => void;
  activeConversation: Conversation | null;
  setActiveConversation: (conversation: Conversation) => void;
  fetchConversations: () => void;
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

  async function fetchConversations() {
    const response = await ConversationService.getAll();
    setIsLoading(true);
    if (response) {
      setConversations(response);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        setConversations,
        activeConversation,
        setActiveConversation,
        fetchConversations,
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
