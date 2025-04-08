"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { io, Socket } from "socket.io-client";
import { logout } from "@/app/actions";
import getUserClient from "@/lib/get-user-client";
import { useMessages, Message } from "../messages-context";
import { Conversation } from "@/services/conversation";

const formSchema = z.object({
  message: z.string().min(1),
});

export function useChat(conversation: Conversation | null) {
  const socketRef = useRef<Socket | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { setMessages, messages } = useMessages();
  const user = getUserClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io("http://localhost:5003");
    const socket = socketRef.current;

    // Join room on connection with user info
    socket.on("connect", () => {
      console.log("Connected to websocket");
    });

    // Listen for incoming messages
    socket.on("receive-message", (payload: Message) => {
      setMessages((prev) => [
        ...prev,
        {
          id: payload.id,
          content: payload.content,
          senderId: payload.senderId,
        } as Message,
      ]);
    });

    // Cleanup on unmount
    return () => {
      socket?.disconnect();
    };
  }, [setMessages]);

  useEffect(() => {
    if (socketRef.current && conversation) {
      socketRef.current.emit("join-room", {
        roomId: conversation.id,
        userId: user.id,
      });
    }
  }, [conversation, user?.id]);

  const sendMessage = (formData: z.infer<typeof formSchema>) => {
    const messageText = formData.message.trim();

    if (messageText.toLocaleLowerCase() === "logout") {
      logout();
    }

    if (messageText && socketRef.current && conversation) {
      socketRef.current.emit("send-message", {
        message: messageText,
        roomId: conversation.id,
        userId: user.id,
        receiverId: conversation.userId,
      });
      form.reset();
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isNotAtBottom = scrollHeight - scrollTop - clientHeight > 30;
    setShowScrollButton(isNotAtBottom);
  };

  return {
    messages: messages.filter(
      (message) => message.senderId === conversation?.userId
    ),
    showScrollButton,
    handleScroll,
    sendMessage,
    form,
    conversation,
  };
}
