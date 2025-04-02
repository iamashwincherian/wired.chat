"use client";

import { useEffect } from "react";
import { logout } from "@/server/auth";
import { toast } from "sonner";

export default function Logout() {
  useEffect(() => {
    toast.success("Successfully logged out!");
    logout();
  }, []);

  return null;
}
