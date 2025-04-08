"use client";

import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Messages from "./messages";
import { Form, FormItem, FormField, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useChat } from "./useChat";
import { useParams } from "next/navigation";
import ConversationService, { Conversation } from "@/services/conversation";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const { id } = useParams();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const { handleScroll, sendMessage, form } = useChat(conversation);

  useEffect(() => {
    ConversationService.findConversation(id as string).then((response) => {
      setConversation(response);
    });
  }, [id]);

  if (!conversation) {
    return null;
  }

  return (
    <>
      <CardHeader className="border-b p-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={conversation.displayImage}
              alt={conversation.name}
            />
            <AvatarFallback>
              {conversation.displayName.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-base">
            {conversation.displayName}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent
        className="flex-1 overflow-y-auto p-4"
        onScroll={handleScroll}
      >
        <Messages conversation={conversation} />
      </CardContent>

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
                    <Input {...field} placeholder={`Type your message...`} />
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
  );
}
