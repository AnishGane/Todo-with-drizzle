import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Block unauthenticated users from protected routes
  if (!session) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }

  // Authenticated → allow request
  return NextResponse.next();   
}

export const config = {
  matcher: ["/todo/:path*"],
};
