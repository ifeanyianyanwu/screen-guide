"use client";

import { Button } from "@/components/ui/button";
import { removeFromWatchlistAction } from "@/lib/actions";
import { Heart, Loader2Icon } from "lucide-react";
import React, { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

interface RemoveFromWatchlistProps {
  session: string;
  id: string;
}

export const RemoveFromWatchlist = ({
  id,
  session,
}: RemoveFromWatchlistProps) => {
  const [state, dispatch] = useFormState(removeFromWatchlistAction, undefined);

  useEffect(() => {
    console.log(state);
    if (state?.success) {
      toast.success("Removed from watchlist successfully");
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  const handleRemoveFromWatchlist = () => {
    dispatch({ id, session });
  };

  return (
    <form action={handleRemoveFromWatchlist}>
      <RemoveFromWatchlistButton />
    </form>
  );
};

const RemoveFromWatchlistButton = () => {
  const { pending } = useFormStatus();
  return (
    <>
      <Button
        size="icon"
        className="flex-shrink-0 hidden md:flex group relative overflow-hidden backdrop-blur-lg bg-foreground/20"
        title="Remove from Watchlist"
        type="submit"
        aria-disabled={pending}
        disabled={pending}
      >
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 group-hover:w-[300px] group-hover:h-[300px] bg-white rounded-full transition-all duration-300" />
        {pending ? (
          <Loader2Icon className="animate-spin text-muted-foreground" />
        ) : (
          <Heart className="h-5 w-5 z-10 fill-white group-hover:fill-black ease-in transition-transform duration-300 fill-mode-forwards" />
        )}
        <span className="sr-only">Remove from Watchlist</span>
      </Button>

      <Button
        className="flex-shrink-0 md:hidden w-full bg-foreground/20"
        title="Remove from Watchlist"
        type="submit"
        aria-disabled={pending}
        disabled={pending}
      >
        {pending ? (
          <Loader2Icon className="animate-spin text-muted-foreground" />
        ) : (
          <Heart fill="white" className="h-5 w-5" />
        )}
        <span className="sr-only">Remove from Watchlist</span>
      </Button>
    </>
  );
};
