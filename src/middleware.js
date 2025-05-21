import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
// This function can be marked `async` if using `await` inside

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  const token = await getToken({ req });

  if (!token && path === "/chat")
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  if (token && path === "/") {
    return NextResponse.redirect(new URL("/chat", req.nextUrl));
  }
}

export const config = {
  matcher: [
    // "/about/:path*",
    "/",
    "/chat",
  ],
};
