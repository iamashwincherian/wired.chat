"use client";

import { ApiClient } from "@/lib/api-client";

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  type?: string;
  status?: string;
  displayName: string;
  displayImage: string;
  userId?: string;
}

const ConversationService = {
  getAll: async (): Promise<Conversation[] | null> => {
    const response = await ApiClient<Conversation[]>(
      "GET",
      "/conversations",
      null,
      {
        auth: true,
      }
    );
    return response.data;
  },
  startConversation: async (
    contactId: string
  ): Promise<Conversation | null> => {
    const response = await ApiClient<Conversation>(
      "POST",
      `/conversations`,
      { id: contactId },
      {
        auth: true,
      }
    );
    return response.data;
  },
  findConversation: async (id: string): Promise<Conversation | null> => {
    const response = await ApiClient<Conversation>(
      "GET",
      `/conversations/${id}`,
      null,
      {
        auth: true,
      }
    );
    return response.data;
  },
};

export default ConversationService;
