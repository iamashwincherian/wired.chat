"use server";

import { cookies } from "next/headers";

export async function deleteUser() {
  (await cookies()).delete("user");
  (await cookies()).delete("token");
}
