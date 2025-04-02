"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { io, Socket } from "socket.io-client";
import { logout } from "@/server/auth";
import getUserClient from "@/lib/get-user-client";
import { useConversation } from "./conversation-context";

interface Message {
  id: number;
  text: string;
  userId: string;
  roomId: string;
  sentByMe: boolean;
}

interface MessagePayload {
  message: string;
  roomId: string;
  userId: string;
}

const formSchema = z.object({
  message: z.string().min(1),
});

export function useChat() {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { activeConversation } = useConversation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
    socket.on("receive-message", (payload) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: payload.message,
          sentByMe: user.id === payload.userId,
          userId: payload.userId,
          roomId: payload.roomId,
        },
      ]);
    });

    // Cleanup on unmount
    return () => {
      socket?.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (socketRef.current && activeConversation) {
      console.log("activeConversation", activeConversation);
      socketRef.current.emit("join-room", {
        roomId: activeConversation.id,
        userId: user.id,
      });
    }
  }, [activeConversation, user?.id]);

  const sendMessage = (formData: z.infer<typeof formSchema>) => {
    const messageText = formData.message.trim();

    if (messageText.toLocaleLowerCase() === "logout") {
      logout();
    }

    if (messageText && socketRef.current && activeConversation) {
      const messagePayload: MessagePayload = {
        message: messageText,
        roomId: activeConversation.id,
        userId: user.id,
      };

      console.log("user", user);
      socketRef.current.emit("send-message", messagePayload);
      form.reset();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isNotAtBottom = scrollHeight - scrollTop - clientHeight > 30;
    setShowScrollButton(isNotAtBottom);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return {
    messages: messages.filter(
      (message) => message.roomId === activeConversation?.id
    ),
    messagesEndRef,
    showScrollButton,
    handleScroll,
    scrollToBottom,
    sendMessage,
    form,
    activeConversation,
  };
}
