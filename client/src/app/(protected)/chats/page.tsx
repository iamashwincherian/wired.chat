"use client";

import { GalleryVerticalEnd, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useConversation } from "./conversation-context";
import AddContactModal from "@/components/modals/add-contact";

export default function ChatHomePage() {
  const { conversations, isLoading } = useConversation();

  return (
    <div className="space-y-4 h-full">
      <div className="h-full w-full flex flex-col justify-center items-center gap-4">
        <GalleryVerticalEnd className="size-12 text-stone-400" />

        <p className="text-4xl font-bold text-stone-400">Wired.Chat</p>
        <p className="text-stone-400 text-center text-[14px] mx-6">
          Stay connected with your colleagues and friends. Start your first
          conversation by adding a contact or joining a group.
        </p>

        {!isLoading && !conversations.length && (
          <AddContactModal
            trigger={
              <Button size={"sm"}>
                <Plus />
                Add Contact
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
