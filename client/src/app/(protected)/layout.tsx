import type { Metadata } from "next";
import Navbar from "@/components/navbar/navbar";
import "../globals.css";
import { Card } from "@/components/ui/card";
import { MessagesProvider } from "./chat/messages-context";
import { ConversationProvider } from "./chat/conversation-context";

export const metadata: Metadata = {
  title: "Wired.Chat",
  description: "A simple chat app for personal and workplace communication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="h-screen">
      <ConversationProvider>
        <MessagesProvider>
          <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <Card className="w-full max-w-4xl shadow-lg flex flex-col md:flex-row h-[600px]">
              {children}
            </Card>
          </div>
          <Navbar />
        </MessagesProvider>
      </ConversationProvider>
    </section>
  );
}
