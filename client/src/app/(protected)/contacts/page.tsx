"use client";

import { UserPlus, Users } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddContactModal from "@/components/modals/add-contact";

export default function Contacts() {
  return (
    <div className="w-full">
      <CardHeader className="border-b p-3">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <CardTitle className="text-base">Contacts</CardTitle>
          <div className="ml-auto">
            <AddContactModal
              trigger={
                <Button size={"sm"}>
                  <UserPlus />
                  Add Contact
                </Button>
              }
            />
          </div>
        </div>
        <div>
          <Input placeholder="Search" className="mt-2" />
        </div>
      </CardHeader>
    </div>
  );
}
