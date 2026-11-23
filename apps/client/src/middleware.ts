import { NextResponse, type NextRequest } from "next/server";
import { verifyJwt } from "./auth/jwt";

const SESSION_COOKIE = "session";

// Clears a session cookie whose JWT is invalid or expired.
export async function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE)?.value;

  if (session && !(await verifyJwt(session))) {
    const response = NextResponse.next();
    response.cookies.set(SESSION_COOKIE, "");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Skip static files and image optimisation requests; they never need the
  // session check and running middleware on them only adds latency.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico)$).*)",
  ],
};
