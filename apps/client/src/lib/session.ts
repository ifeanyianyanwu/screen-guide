import "server-only";

import { getWatchList } from "@/api/server";
import { verifyJwt } from "@/auth";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "session";

export type InvalidSession = {
  isValid: false;
  session: undefined;
};
export type ValidSession = {
  isValid: true;
  session: string;
};
export type Session = ValidSession | InvalidSession;

export async function getSession(): Promise<Session> {
  const session = cookies().get(SESSION_COOKIE)?.value;

  if (!session) return { isValid: false, session: undefined };

  const isValid = await verifyJwt(session);
  if (isValid) {
    return { isValid, session };
  }

  return { isValid: false, session: undefined };
}

export async function getWatchlistStatus(session: Session, id: string) {
  if (!session.isValid) {
    return { isInWatchList: false, watchlistItemId: undefined };
  }

  const res = await getWatchList(session.session);
  const watchlistItemId = res.data.items.find(
    (item) => Number(item.mediaId) === Number(id)
  )?._id;

  return {
    isInWatchList: watchlistItemId !== undefined,
    watchlistItemId,
  };
}
