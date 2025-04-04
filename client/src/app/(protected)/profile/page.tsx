"use client";

import getUserClient from "@/lib/get-user-client";

export default function Profile() {
  const user = getUserClient();

  return (
    <div className="p-4">
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}
