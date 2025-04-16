"use client";

import { UserPlus, Users } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddContactModal from "@/components/modals/add-contact";
import Requests from "./requests";
import AllContacts from "./all-contacts";
import { useEffect, useState } from "react";
import { ApiClient } from "@/lib/api-client";
import { ContactType } from "./types";

export default function Contacts() {
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState<ContactType[]>([]);

  const fetchContacts = async () => {
    const response = await ApiClient("GET", "/contacts", null, {
      auth: true,
    });
    if (response.success) {
      setContacts(response.data as ContactType[]);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    clearTimeout(
      (handleSearchChange as { timeout?: ReturnType<typeof setTimeout> })
        .timeout
    );
    (
      handleSearchChange as { timeout?: ReturnType<typeof setTimeout> }
    ).timeout = setTimeout(() => {
      setSearch(value);
    }, 300);
  };

  return (
    <div className="flex flex-col w-full h-full">
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
        <Input
          placeholder="Search"
          className="mt-2"
          onChange={handleSearchChange}
        />
      </CardHeader>
      <CardContent className="p-3 flex-1 flex flex-col">
        <Requests onAccept={fetchContacts} onReject={fetchContacts} />
        <AllContacts contacts={contacts} search={search} />
      </CardContent>
    </div>
  );
}
