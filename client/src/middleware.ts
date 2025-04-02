import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserAndToken } from "./server/auth";

export async function middleware(request: NextRequest) {
  // Check if user and token cookies exist
  const { user, token } = await getUserAndToken();

  // If either cookie is missing, redirect to login page
  if (!user || !token) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Continue with the request if authorized
  return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
  matcher: ["/chat"],
};
