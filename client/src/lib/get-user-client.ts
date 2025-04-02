"use client";

import Cookies from "js-cookie";
import { redirect } from "next/navigation";

const isClient = typeof window !== "undefined";

interface GetUserClientProps {
  redirect?: boolean;
}

const defaultProps: GetUserClientProps = {
  redirect: true,
};

export default function getUserClient(
  props: GetUserClientProps = defaultProps
) {
  const user = Cookies.get("user");
  if (!user && props.redirect && isClient) {
    redirect("/auth/login");
  }

  return user ? JSON.parse(user) : null;
}
