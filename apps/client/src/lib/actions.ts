"use server";

import { addToWatchList, removeFromWatchList } from "@/api/server";
import { signIn, signUp } from "@/auth";
import { getSession, SESSION_COOKIE } from "@/lib/session";
import { TWatchListItemSchema } from "@screen-guide/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const setSessionCookie = (token: string) => {
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
};

export async function signInAction(_currentState: unknown, formData: FormData) {
  try {
    const res = await signIn(formData);
    setSessionCookie(res.data.token);
    return { success: true };
  } catch (error) {
    if (error) {
      if (Array.isArray(error)) return { error: error[0] };
      if (typeof error === "string") return { error };
      else return { error: "Something went wrong." };
    }
    throw error;
  }
}

export async function signUpAction(_currentState: unknown, formData: FormData) {
  try {
    const res = await signUp(formData);
    setSessionCookie(res.data.token);
    return { success: true };
  } catch (error) {
    if (error) {
      if (Array.isArray(error)) return { error: error[0] };
      if (typeof error === "string") return { error };
      else return { error: "Something went wrong." };
    }
    throw error;
  }
}

// The session token is read from the httpOnly cookie on the server. It is
// never sent to (or accepted from) the browser.
export async function removeFromWatchlistAction(
  _currentState: unknown,
  { id }: { id: string }
) {
  const session = await getSession();
  if (!session.isValid) return { error: "Please sign in again." };

  try {
    await removeFromWatchList(id, session.session);
  } catch (error) {
    if (error) {
      if (typeof error === "string") return { error };
      else return { error: "Something went wrong." };
    }
    throw error;
  }
  revalidatePath("/watch-list");
  revalidatePath("/movie/[id]", "page");
  revalidatePath("/tv/[id]", "page");
  return { success: true };
}

export async function addToWatchlistAction(
  _currentState: unknown,
  { body }: { body: TWatchListItemSchema }
) {
  const session = await getSession();
  if (!session.isValid) return { error: "Please sign in again." };

  try {
    await addToWatchList(body, session.session);
  } catch (error) {
    if (error) {
      if (typeof error === "string") return { error };
      else return { error: "Something went wrong." };
    }
    throw error;
  }
  revalidatePath("/watch-list");
  revalidatePath("/movie/[id]", "page");
  revalidatePath("/tv/[id]", "page");
  return { success: true };
}

export async function logout() {
  //Destroy the session
  cookies().set(SESSION_COOKIE, "");
}
