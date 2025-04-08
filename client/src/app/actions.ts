"use server";

import { cookies as getCookies } from "next/headers";
import { redirect } from "next/navigation";

export interface User {
  id: string;
  email: string;
  name: string;
}

export const login = async (user: User, token: string) => {
  const cookies = await getCookies();
  cookies.set({
    name: "user",
    value: JSON.stringify(user),
    httpOnly: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
  cookies.set({
    name: "token",
    value: token,
    httpOnly: false,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
};

export const logout = async () => {
  const cookies = await getCookies();
  cookies.delete("user");
  cookies.delete("token");
  redirect("/auth/login");
};

export const getUserAndToken = async () => {
  const cookies = await getCookies();
  const user = cookies.get("user");
  const token = cookies.get("token");
  return { user, token };
};

export const getUser = async () => {
  const { user } = await getUserAndToken();
  return user;
};

export const getToken = async () => {
  const { token } = await getUserAndToken();
  return token;
};
