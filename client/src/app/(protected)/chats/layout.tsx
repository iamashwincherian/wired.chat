import { CardTitle } from "@/components/ui/card";

import { MessageSquare } from "lucide-react";

import { CardHeader } from "@/components/ui/card";
import RecentConversations from "./recent-conversations";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
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

      <div className="flex-1 flex flex-col">{children}</div>
    </>
  );
};

export default ChatLayout;
