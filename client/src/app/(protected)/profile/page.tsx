"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Mail,
  Calendar,
  BookUser,
  UserRoundCheck,
  BadgeCheck,
} from "lucide-react";
import getUserClient from "@/lib/get-user-client";
import { useIsClient } from "@/lib/use-is-client";
import { logout } from "@/app/actions";

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

export default function Profile() {
  const user = getUserClient();
  if (!useIsClient()) return;

  if (!user) return;

  return (
    <div
      className={`p-6 border-b md:border-b-0 md:border-r md:w-1/3 flex flex-col items-center`}
    >
      <Avatar className="h-24 w-24 mb-4">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
      </Avatar>

      <h2 className="text-xl font-bold">{user.name}</h2>
      <p className="text-muted-foreground mb-4">Free User</p>

      <div className="w-full space-y-4 mt-2">
        <div className="flex items-center space-x-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{user.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Joined {DATE_FORMAT.format(new Date(user.createdAt))}</span>
        </div>
        {user.provider && (
          <div className="flex items-center space-x-2 text-sm">
            <UserRoundCheck className="h-4 w-4 text-muted-foreground" />
            <span>
              Social: <span className="capitalize">{user.provider}</span>
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2 w-full mt-auto">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center text-destructive hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
