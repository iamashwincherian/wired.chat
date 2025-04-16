import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ConversationService from "@/services/conversation";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { ContactType } from "./types";
import { useConversation } from "../chats/conversation-context";

export default function AllContacts({
  search,
  contacts,
}: {
  search: string;
  contacts: ContactType[];
}) {
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.user.name.toLowerCase().includes(search.toLowerCase()) ||
      contact.user.email.toLowerCase().includes(search.toLowerCase())
  );
  const router = useRouter();
  const { fetchConversations } = useConversation();

  const startConversation = async (contactId: string) => {
    const response = await ConversationService.startConversation(contactId);
    if (response) {
      router.push(`/chats/${response.id}`);
      fetchConversations();
    }
  };

  if (contacts.length && !filteredContacts.length) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <p className="text-2xl font-bold text-stone-400">
          No results found for your search.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {filteredContacts.length ? (
        <div className="grid grid-cols-2">
          {filteredContacts.map((contact, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:bg-muted hover:border-border transition-colors cursor-pointer"
              onClick={() => startConversation(contact.id)}
            >
              <div className="flex gap-3 items-center">
                <div>
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={contact.user.avatar}
                      alt={contact.user.name}
                    />
                    <AvatarFallback>
                      {contact.user.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <p className="font-semibold">{contact.user.name}</p>
                  <p className="text-sm text-gray-500">{contact.user.email}</p>
                </div>
              </div>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <Users className="size-12 text-stone-400" />
          <p className="text-4xl font-bold text-stone-400">No Contacts</p>
          <p className="text-stone-400 text-center text-[14px] w-[500px]">
            Stay connected with your colleagues and friends. Start your first
            conversation by adding a contact or joining a group.
          </p>
        </div>
      )}
    </div>
  );
}
