"use client";

import { Send, Users, ArrowDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useChat } from "./useChat";
import { ConversationProvider, useConversation } from "./conversation-context";
import Conversations from "./conversations";

const ChatContent = () => {
  const {
    messages,
    messagesEndRef,
    showScrollButton,
    handleScroll,
    scrollToBottom,
    sendMessage,
    form,
  } = useChat();

  const { activeConversation } = useConversation();
  console.log("activeConversation", activeConversation);

  return (
    <Card className="w-full max-w-4xl shadow-lg flex flex-col md:flex-row h-[600px]">
      <div className="w-full md:w-64 border-r">
        <CardHeader className="border-b p-3">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <CardTitle className="text-base">Contacts</CardTitle>
          </div>
        </CardHeader>

        <div className="overflow-y-auto h-[calc(600px-56px-64px)]">
          <Conversations />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {activeConversation && (
          <>
            <CardHeader className="border-b p-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={activeConversation.avatar}
                    alt={activeConversation.name}
                  />
                  <AvatarFallback>
                    {activeConversation.displayName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-base">
                  {activeConversation.displayName}
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent
              className="flex-1 overflow-y-auto p-4"
              onScroll={handleScroll}
            >
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm">
                    Send a message to start chatting with{" "}
                    {activeConversation.name}
                  </p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sentByMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`text-sm rounded-lg px-3 py-1.5 max-w-[85%] ${
                          message.sentByMe
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {showScrollButton && (
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-20 right-6 h-8 w-8 rounded-full shadow-md"
                onClick={scrollToBottom}
              >
                <ArrowDown size={16} />
              </Button>
            )}

            <CardFooter className="border-t p-3">
              <Form {...form}>
                <form
                  className="flex gap-2 w-full"
                  onSubmit={form.handleSubmit(sendMessage)}
                >
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={`Type your message...`}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardFooter>
          </>
        )}
      </div>
    </Card>
  );
};

export default function ChatApp() {
  return (
    <ConversationProvider>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <ChatContent />
      </div>
    </ConversationProvider>
  );
}
