"use client";

import Cookies from "js-cookie";

export const BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

export const ApiClient = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  data?: unknown,
  options?: { auth?: boolean }
): Promise<{
  data: T | null;
  success: boolean;
  error?: Error | unknown;
}> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (options?.auth) {
    const token = Cookies.get("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    return {
      success: false,
      data: null,
      error: await response.json(),
    };
  }

  const responseData = await response.json();
  return {
    success: true,
    data: responseData,
  };
};
