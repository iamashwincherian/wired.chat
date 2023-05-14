import { ChevronDownIcon, HashtagIcon } from "@heroicons/react/24/solid";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  BookmarkIcon,
  AtSymbolIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

const WorkspaceNameButton = ({ name }: { name: string }) => (
  <div className="flex dark:hover:bg-zinc-700 p-2 rounded-md shadow-sm cursor-pointer transition-colors">
    <p className="font-semibold text-mg tracking-wider">{name}</p>
    <ChevronDownIcon height={16} width={16} className="ml-2 mt-1" />
  </div>
);

const Link = ({ name, icon: Icon = null }: { name: string; icon?: any }) => (
  <div className="py-1 px-3 flex items-center dark:hover:bg-zinc-700 hover:shadow rounded-md cursor-pointer transition-colors group mb-1 hover:bg-gray-50">
    {Icon && (
      <Icon
        height={18}
        width={18}
        className="text-slate-400 dark:group-hover:text-white"
      />
    )}
    <span className="ml-2 dark:text-slate-400 dark:group-hover:text-white text-sm">
      {name}
    </span>
  </div>
);

const QuickLinks = () => {
  const list = [
    { name: "Threads", icon: ChatBubbleOvalLeftEllipsisIcon },
    { name: "Later", icon: BookmarkIcon },
    { name: "Mentions & reactions", icon: AtSymbolIcon },
    { name: "Drafts & sent", icon: PaperAirplaneIcon },
    { name: "Slack connect", icon: BuildingOfficeIcon },
  ];

  return (
    <div className="p-3">
      {list.map(({ name, icon }) => (
        <Link key={name} name={name} icon={icon} />
      ))}
    </div>
  );
};

const Divider = () => <hr className="dark:border-neutral-700"></hr>;

const Channels = () => {
  const icon = HashtagIcon;
  const channelList = ["general", "dev-channel", "rules", "memes"];
  return (
    <div className="p-3">
      <p className="px-3 mb-2 dark:text-slate-400 text-sm">Channels:</p>
      {channelList.map((name) => (
        <Link key={name} name={name} icon={icon} />
      ))}
    </div>
  );
};

export default function Sidebar() {
  const workspaceName = "Team App.Labs";

  return (
    <div className="flex flex-col w-64 h-screen dark:bg-sidebar-bg border-r dark:border-neutral-700">
      <div className="p-3 pb-5">
        <WorkspaceNameButton name={workspaceName} />
      </div>
      <Divider />
      <QuickLinks />
      <Divider />
      <Channels />
      <Divider />
    </div>
  );
}
