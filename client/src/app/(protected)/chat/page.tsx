"use client";

import { MessageSquare, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useChat } from "./useChat";
import { useConversation } from "./conversation-context";
import Messages from "./messages";
import RecentConversations from "./recent-conversations";

const ChatContent = () => {
  const { handleScroll, sendMessage, form } = useChat();
  const { activeConversation } = useConversation();

  return (
    <>
      <div className="w-full md:w-64 border-r">
        <CardHeader className="border-b p-3">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <CardTitle className="text-base">Recent Conversations</CardTitle>
          </div>
        </CardHeader>

        <div className="overflow-y-auto h-[calc(600px-56px-64px)]">
          <RecentConversations />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {activeConversation && (
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
        )}

        <CardContent
          className="flex-1 overflow-y-auto p-4"
          onScroll={handleScroll}
        >
          <Messages />
        </CardContent>

        {/* {showScrollButton && (
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-20 right-6 h-8 w-8 rounded-full shadow-md"
                onClick={scrollToBottom}
              >
                <ArrowDown size={16} />
              </Button>
            )} */}

        {activeConversation && (
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
        )}
      </div>
    </>
  );
};

export default function ChatApp() {
  return <ChatContent />;
}
