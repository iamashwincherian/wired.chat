"use client";

import { useState } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target?.value);
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="h-full p-5">
        <p className="text-xl text-neutral-300"># dev-channel</p>
      </div>
      <div className="p-3">
        <input
          value={message}
          onChange={handleChange}
          className="w-full p-3 bg-transparent border dark:border-neutral-700 outline-none dark:text-neutral-300 text-sm"
        />
      </div>
    </div>
  );
}
