type MessageProps = {
  message: string;
  type: string;
  user?: string;
};

export default function Message({ message, type, user }: MessageProps) {
  return (
    <div
      className={`mb-5 mx-4 ${type === "mine" && "self-end"} ${
        type === "mod" && "self-center"
      }`}
    >
      <p className="mb-2">{type !== "mod" ? user : ""}</p>
      <div className="border border-neutral-700 w-fit h-fit px-3 py-1 rounded-md">
        {message}
      </div>
    </div>
  );
}
