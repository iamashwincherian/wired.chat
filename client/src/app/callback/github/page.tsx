"use client";

import { redirect, useSearchParams } from "next/navigation";
import { login, User } from "@/app/actions";
import { useEffect, useState } from "react";
import { ApiClient } from "@/lib/api-client";
import Loader from "@/components/loader/loader";

export default function GithubCallbackPage() {
  const searchParams = useSearchParams();
  const [userFetched, setUserFetched] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { code } = Object.fromEntries(searchParams.entries());
      const url = `/auth/github/callback?code=${code}`;
      const { data } = await ApiClient<{ user: User; token: string }>(
        "GET",
        url,
        null
      );
      if (data?.user) {
        await login(data.user, data.token);
        setUserFetched(true);
      }
    };
    fetchUser();
  }, [searchParams]);

  if (userFetched) {
    redirect("/");
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader />
    </div>
  );
}
