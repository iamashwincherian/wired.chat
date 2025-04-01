"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { io, Socket } from "socket.io-client";
import { contacts } from "./contacts";

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
  message: z.string().min(1, { message: "Message is required" }),
});

export function useChat() {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [activeChat, setActiveChat] = useState(contacts[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userId] = useState(`user-${Math.floor(1000 + Math.random() * 9000)}`);

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

    // Join room on connection
    socket.on("connect", () => {
      console.log("Connected to websocket");
      socket.emit("join-room", activeChat.id);
    });

    // Listen for incoming messages
    socket.on("receive-message", (payload) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: payload.message,
          sentByMe: userId === payload.userId,
          userId: payload.userId,
          roomId: payload.roomId,
        },
      ]);
    });

    // Cleanup on unmount
    return () => {
      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      // Leave previous room and join new room when activeChat changes
      socketRef.current.emit("join-room", activeChat.id);
    }
  }, [activeChat]);

  const sendMessage = (formData: z.infer<typeof formSchema>) => {
    const messageText = formData.message.trim();

    if (messageText && socketRef.current) {
      // Create message payload
      const messagePayload: MessagePayload = {
        message: messageText,
        roomId: activeChat.id,
        userId,
      };

      // Send to websocket
      socketRef.current.emit("send-message", messagePayload);

      // Reset form
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
    messages: messages.filter((message) => message.roomId === activeChat.id),
    messagesEndRef,
    showScrollButton,
    handleScroll,
    scrollToBottom,
    sendMessage,
    form,
    activeChat,
    setActiveChat,
  };
}
