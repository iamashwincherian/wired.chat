"use client";

import { redirect, useSearchParams } from "next/navigation";
import { login, User } from "@/app/actions";
import { useEffect, useState } from "react";
import { ApiClient } from "@/lib/api-client";
import Loader from "@/components/loader/loader";

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const [userFetched, setUserFetched] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { code, scope } = Object.fromEntries(searchParams.entries());
      const url = `/auth/google/callback?code=${code}&scope=${
        scope && encodeURIComponent(scope)
      }`;
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
