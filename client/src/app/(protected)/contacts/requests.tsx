"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ApiClient } from "@/lib/api-client";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

interface RequestType {
  id: string;
  sender: {
    name: string;
    email: string;
    avatar: string;
  };
}

interface RequestsProps {
  onAccept?: () => void;
  onReject?: () => void;
}

export default function Requests(props: RequestsProps) {
  const { onAccept } = props;
  const [requests, setRequests] = useState<RequestType[]>([]);

  const fetchRequests = async () => {
    const response = await ApiClient("GET", "/contacts/requests", null, {
      auth: true,
    });
    if (response.success) {
      setRequests(response.data as RequestType[]);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const acceptRequest = async (id: string) => {
    const response = await ApiClient(
      "POST",
      `/contacts/requests/${id}/accept`,
      null,
      {
        auth: true,
      }
    );
    if (response.success) {
      toast.success("Request accepted!");
      fetchRequests();
      onAccept?.();
    }
  };

  if (!requests.length) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold">Requests</h3>
      <div className="flex flex-col gap-3 mt-3">
        {requests.map(({ id, sender: { name, email, avatar } }) => (
          <div
            key={id}
            className="flex gap-3 items-center border p-3 rounded-lg justify-between"
          >
            <div className="flex gap-3 items-center">
              <div>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={avatar} alt={name} />
                  <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="font-semibold">{name}</p>
                <p className="text-sm text-gray-500">{email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => acceptRequest(id)}>
                <Check />
                Accept
              </Button>
              <Button variant={"outline"}>
                <X />
                Decline
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
