import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // if user is not signed in redirect the user to /(login)
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If route includes /c/ then check if user can get session
  if (req.nextUrl.pathname.includes("/c")) {
    // Get dynamic route parameter
    const id = req.nextUrl.pathname.split("/")[2];
    if (id) {
      const { data: session } = await supabase
        .from("Sessions")
        .select("*")
        .eq("id", id);
      if (session) {
        if (session.length === 0) {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }
    }
  }
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|login|auth/callback).*)",
  ],
};
