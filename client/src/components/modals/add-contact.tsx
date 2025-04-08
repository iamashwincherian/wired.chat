import { Search } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApiClient } from "@/lib/api-client";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";
interface AddContactModalProps {
  trigger: React.ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  receivedRequests: {
    status: "pending" | "declined";
  }[];
}

const formSchema = z.object({
  email: z.string(),
});

const requestSentStates = ["pending", "notSent", "declined", "loading"];

const SearchUserItem = ({ user }: { user: User }) => {
  const requestStatus = user.receivedRequests?.[0]?.status;
  const [requestSentState, setRequestSentState] = useState<
    "pending" | "notSent" | "declined" | "loading"
  >(requestSentStates.includes(requestStatus) ? requestStatus : "notSent");

  const onRequest = async (id: string) => {
    setRequestSentState("loading");
    const response = await ApiClient(
      "POST",
      `/contacts/request`,
      {
        id,
      },
      {
        auth: true,
      }
    );
    if (response.success) {
      toast.success("Contact request sent successfully");
      setRequestSentState("pending");
    } else {
      setRequestSentState("notSent");
    }
  };

  return (
    <div key={user.id} className="flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <div>
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onRequest(user.id)}
        disabled={requestSentState !== "notSent"}
      >
        {requestSentState === "loading"
          ? "Loading"
          : requestSentState === "pending"
          ? "Request Sent"
          : "Request"}
      </Button>
    </div>
  );
};

export default function AddContactModal({ trigger }: AddContactModalProps) {
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setSearchResults([]);
      form.reset();
    }
  };

  const onSearch = async ({ email }: z.infer<typeof formSchema>) => {
    const response = await ApiClient(
      "GET",
      `/users/search?email=${email}`,
      null,
      {
        auth: true,
      }
    );
    if (response.success && response.data) {
      setSearchResults(response.data as User[]);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="gap-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSearch)}>
            <DialogHeader>
              <DialogTitle>Add a new contact</DialogTitle>
              <DialogDescription>
                Enter the email ID of the person you want to add as a contact. A
                request will be sent to them, and once they accept, you can
                start chatting.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 items-center">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="my-4 flex-1">
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size={"icon"}>
                <Search />
              </Button>
            </div>
          </form>
        </Form>
        <div className="flex flex-col gap-2">
          {searchResults.length > 0 && (
            <div className="border rounded p-3">
              {searchResults.map((user) => (
                <SearchUserItem key={user.id} user={user} />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
