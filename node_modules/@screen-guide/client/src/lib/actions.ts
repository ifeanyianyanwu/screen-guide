"use server";

import { addToWatchList, removeFromWatchList } from "@/api/server";
import { signIn, signUp } from "@/auth";
import { TWatchListItemSchema } from "@screen-guide/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signInAction(_currentState: unknown, formData: FormData) {
  try {
    const res = await signIn(formData);
    cookies().set("session", res.data.token, { httpOnly: true });
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
    cookies().set("session", res.data.token, { httpOnly: true });
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

export async function removeFromWatchlistAction(id: string, session: string) {
  try {
    await removeFromWatchList(id, session);
  } catch (error) {
    if (error) {
      if (typeof error === "string") throw error;
      else throw "Something went wrong.";
    }
    throw error;
  }
  revalidatePath("/watch-list");
}

export async function addToWatchlistAction(
  body: TWatchListItemSchema,
  session: string
) {
  try {
    await addToWatchList(body, session);
  } catch (error) {
    if (error) {
      if (typeof error === "string") throw error;
      else throw "Something went wrong.";
    }
    throw error;
  }
  revalidatePath("/watch-list");
}

export async function logout() {
  //Destroy the session
  cookies().set("session", "");
  redirect("/");
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return session;
}
