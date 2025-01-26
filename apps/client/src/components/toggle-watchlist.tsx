"use client";

import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { Heart, Loader2Icon } from "lucide-react";
import Link from "next/link";
import {
  addToWatchlistAction,
  InvalidSession,
  removeFromWatchlistAction,
  ValidSession,
} from "@/lib/actions";
import { TWatchListItemSchema } from "@screen-guide/types";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

interface WatchlistButtonProps {
  isInWatchList?: boolean;
}

interface ToggleWatchlistProps {
  isInWatchList: boolean;
  session: ValidSession | InvalidSession;
  media: TWatchListItemSchema & { _id?: string };
}

const WatchlistButton = ({ isInWatchList }: WatchlistButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      className="absolute bottom-4 inset-x-4 overflow-hidden bg-background/20 backdrop-blur-lg group hover:bg-background/20"
      size="lg"
      type="submit"
      aria-disabled={pending}
      disabled={pending}
    >
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 
       group-hover:w-[500px] group-hover:h-[500px] 
       bg-white rounded-full 
       transition-all duration-500 ease-in"
      />
      <span className="relative z-10 group-hover:text-black text-white transition-all delay-200 flex gap-x-2 text-base items-center ease-in">
        {pending ? (
          <Loader2Icon className="animate-spin text-muted-foreground" />
        ) : isInWatchList ? (
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
  const [removeActionState, dispatchRemove] = useFormState(
    removeFromWatchlistAction,
    undefined
  );
  const [addActionState, dispatchAdd] = useFormState(
    addToWatchlistAction,
    undefined
  );

  useEffect(() => {
    if (addActionState?.success) {
      toast.success("Added to watchlist successfully");
    }
    if (addActionState?.error) {
      toast.error(addActionState.error);
    }
  }, [addActionState]);

  useEffect(() => {
    if (removeActionState?.success) {
      toast.success("Removed from watchlist successfully");
    }
    if (removeActionState?.error) {
      toast.error(removeActionState.error);
    }
  }, [removeActionState]);

  if (!session.isValid) {
    return (
      <Link href="/signin">
        <WatchlistButton />
      </Link>
    );
  }

  const handleWatchlistToggle = () => {
    if (isInWatchList) {
      if (!media._id) {
        console.error("Missing media ID");
        return;
      }

      dispatchRemove({ id: media._id, session: session.session });
    } else {
      dispatchAdd({ body: media, session: session.session });
    }
  };

  return (
    <form action={handleWatchlistToggle}>
      <WatchlistButton isInWatchList={isInWatchList} />
    </form>
  );
};
