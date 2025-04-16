"use client";

import {
  createContext,
  SetStateAction,
  Dispatch,
  useContext,
  useState,
} from "react";
import { ApiClient } from "@/lib/api-client";

export interface Message {
  id: string;
  content: string;
  senderId: string;
  roomId: string;
}

interface MessagesContextType {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  isLoading: boolean;
  fetchMessages: (conversationId: string) => Promise<void>;
}

const MessagesContext = createContext<MessagesContextType | undefined>(
  undefined
);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async (conversationId: string) => {
    setIsLoading(true);
    const response = await ApiClient<Message[]>(
      "GET",
      `/conversations/${conversationId}/messages`,
      null,
      { auth: true }
    );

    if (response.success && response.data) {
      setMessages(response.data);
    }
    setIsLoading(false);
  };

  return (
    <MessagesContext.Provider
      value={{ messages, setMessages, fetchMessages, isLoading }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessagesProvider");
  }
  return context;
}
