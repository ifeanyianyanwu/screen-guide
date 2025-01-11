"use client";

import React from "react";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";
import {
  addToWatchlistAction,
  InvalidSession,
  removeFromWatchlistAction,
  ValidSession,
} from "@/lib/actions";
import { TWatchListItemSchema } from "@screen-guide/types";

interface WatchlistButtonProps {
  action: () => Promise<void>;
  isInWatchList?: boolean;
}

interface ToggleWatchlistProps {
  isInWatchList: boolean;
  session: ValidSession | InvalidSession;
  media: TWatchListItemSchema & { _id?: string };
}

const WatchlistButton = ({ action, isInWatchList }: WatchlistButtonProps) => {
  return (
    <Button
      className="absolute bottom-4 inset-x-4 overflow-hidden bg-background/20 backdrop-blur-lg group hover:bg-background/20"
      size="lg"
      onClick={action}
    >
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 
       group-hover:w-[500px] group-hover:h-[500px] 
       bg-white rounded-full 
       transition-all duration-500 ease-in"
      />
      <span className="relative z-10 group-hover:text-black text-white transition-all delay-200 flex gap-x-2 text-base items-center ease-in">
        {isInWatchList ? (
          <Heart className="h-5 w-5 " fill="white" />
        ) : (
          <Heart className="h-5 w-5 " />
        )}
        {isInWatchList ? "Remove from watch list" : "Add to watch list"}
      </span>
    </Button>
  );
};

export const ToggleWatchlist = ({
  isInWatchList,
  media,
  session,
}: ToggleWatchlistProps) => {
  if (!session.isValid) {
    return (
      <Link href="/signin">
        <WatchlistButton action={async () => {}} />
      </Link>
    );
  }

  const handleWatchlistToggle = async () => {
    if (isInWatchList) {
      if (!media._id) {
        console.error("Missing media ID");
        return;
      }

      await removeFromWatchlistAction(media._id, session.session);
    } else {
      await addToWatchlistAction(media, session.session);
    }
  };

  return (
    <WatchlistButton
      action={handleWatchlistToggle}
      isInWatchList={isInWatchList}
    />
  );
};
