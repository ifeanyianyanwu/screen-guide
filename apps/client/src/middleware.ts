import { NextResponse } from "next/server";
import { getSession } from "./lib/actions";

export async function middleware() {
  const session = await getSession();

  if (!session.isValid) {
    const response = NextResponse.next();
    response.cookies.set("session", "");

    return response;
  }

  return NextResponse.next();
}
