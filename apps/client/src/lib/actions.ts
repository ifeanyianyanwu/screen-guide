"use server";

import {
  addToWatchList,
  getWatchList,
  removeFromWatchList,
} from "@/api/server";
import { signIn, signUp, verifyJwt } from "@/auth";
import { TWatchListItemSchema } from "@screen-guide/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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
  revalidatePath("/movie/[id]", "page");
  revalidatePath("/tv/[id]", "page");
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
  revalidatePath("/movie/[id]", "page");
  revalidatePath("/tv/[id]", "page");
}

export async function logout() {
  //Destroy the session
  cookies().set("session", "");
  // redirect("/");
}

export type InvalidSession = {
  isValid: false;
  session: undefined;
};
export type ValidSession = {
  isValid: true;
  session: string;
};

export async function getSession() {
  const session = cookies().get("session")?.value;

  if (!session) return { isValid: false, session } as InvalidSession;

  const isValid = await verifyJwt(session);
  if (isValid) {
    return { isValid, session } as ValidSession;
  }

  return { isValid: false, session: undefined } as InvalidSession;
}

export async function getWatchlistStatus(
  session: Awaited<ReturnType<typeof getSession>>,
  id: string
) {
  if (!session.isValid) {
    return { isInWatchList: false, watchlistItemId: undefined };
  }

  const res = await getWatchList(session.session);
  const mediaIds = res.data.items.map((item) => Number(item.mediaId));
  const watchlistItemId = res.data.items.find(
    (item) => item.mediaId === Number(id)
  )?._id;

  return {
    isInWatchList: mediaIds.includes(Number(id)),
    watchlistItemId,
  };
}
