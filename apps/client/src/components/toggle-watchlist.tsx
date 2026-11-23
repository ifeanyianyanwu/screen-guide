"use client";

import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { Heart, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { addToWatchlistAction, removeFromWatchlistAction } from "@/lib/actions";
import { TWatchListItemSchema } from "@screen-guide/types";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

interface WatchlistButtonProps {
  isInWatchList?: boolean;
  /** Render as a non-interactive span (for use inside a link). */
  asLinkContent?: boolean;
}

interface ToggleWatchlistProps {
  isInWatchList: boolean;
  isLoggedIn: boolean;
  media: TWatchListItemSchema & { _id?: string };
}

const WatchlistButton = ({
  isInWatchList,
  asLinkContent = false,
}: WatchlistButtonProps) => {
  const { pending } = useFormStatus();

  const content = (
    <>
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
    </>
  );

  const className =
    "absolute bottom-4 inset-x-4 overflow-hidden bg-background/20 backdrop-blur-lg group hover:bg-background/20";

  if (asLinkContent) {
    return (
      <Button asChild className={className} size="lg">
        <span>{content}</span>
      </Button>
    );
  }

  return (
    <Button
      className={className}
      size="lg"
      type="submit"
      aria-disabled={pending}
      disabled={pending}
    >
      {content}
    </Button>
  );
};

export const ToggleWatchlist = ({
  isInWatchList,
  media,
  isLoggedIn,
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

  if (!isLoggedIn) {
    return (
      <Link href="/signin">
        <WatchlistButton asLinkContent />
      </Link>
    );
  }

  const handleWatchlistToggle = () => {
    if (isInWatchList) {
      if (!media._id) {
        console.error("Missing media ID");
        return;
      }

      dispatchRemove({ id: media._id });
    } else {
      dispatchAdd({ body: media });
    }
  };

  return (
    <form action={handleWatchlistToggle}>
      <WatchlistButton isInWatchList={isInWatchList} />
    </form>
  );
};
