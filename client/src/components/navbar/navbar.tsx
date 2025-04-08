"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "../ui/tooltip";
import {
  MessageSquare,
  Users,
  Search,
  Bell,
  User,
  Settings,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: "messages", icon: MessageSquare, label: "Messages", href: "/chats" },
  { id: "contacts", icon: Users, label: "Contacts", href: "/contacts" },
  // { id: "search", icon: Search, label: "Search", href: "/search" },
  // {
  //   id: "notifications",
  //   icon: Bell,
  //   label: "Notifications",
  //   href: "/notifications",
  // },
  { id: "profile", icon: User, label: "Profile", href: "/profile" },
  // { id: "settings", icon: Settings, label: "Settings", href: "/settings" },
];

export default function Navbar() {
  const router = useRouter();
  const path = usePathname();
  const navItemFromPath =
    navItems.find((item) => new RegExp(`^${path}$`).test(item.href)) ||
    navItems[0];
  const [activeNav, setActiveNav] = useState<NavItem>(navItemFromPath);
  const [prevNav, setPrevNav] = useState<NavItem>(activeNav);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPrevNav(activeNav);
    }, 300);
    return () => clearTimeout(timer);
  }, [activeNav]);

  useEffect(() => {
    setActiveNav(navItemFromPath);
  }, [navItemFromPath]);

  const switchTab = (navItem: NavItem) => {
    setActiveNav(navItem);
    router.push(navItem.href);
  };

  return (
    <TooltipProvider>
      <div className="fixed bottom-2 left-0 right-0 flex justify-center p-4 z-10">
        <div className="bg-background/80 backdrop-blur-md rounded-full shadow-lg border px-1 py-1 flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav.id === item.id;
            const wasActive = prevNav.id === item.id;

            return (
              <div key={item.id} className="relative">
                {isActive ? (
                  <Button
                    variant="default"
                    size="sm"
                    className={`rounded-full flex items-center gap-2 transition-all duration-300 ${
                      isActive && !wasActive ? "animate-bubble-expand" : ""
                    }`}
                    onClick={() => switchTab(item)}
                  >
                    <Icon className="h-5 w-5" />
                    <span
                      className={`text-xs ${
                        isActive ? "inline-block" : "hidden"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Button>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full p-2"
                        onClick={() => switchTab(item)}
                      >
                        <Icon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="mb-1">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
