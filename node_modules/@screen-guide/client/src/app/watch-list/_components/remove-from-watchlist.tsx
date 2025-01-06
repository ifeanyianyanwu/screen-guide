"use client";

import { Button } from "@/components/ui/button";
import { removeFromWatchlistAction } from "@/lib/actions";
import { Heart } from "lucide-react";
import React from "react";

export const RemoveFromWatchlist = ({
  id,
  session,
}: {
  session: string;
  id: string;
}) => {
  return (
    <Button
      size="icon"
      variant="ghost"
      className="flex-shrink-0 text-gray-400 hover:text-white"
      title="Remove from Watchlist"
      onClick={async () => {
        await removeFromWatchlistAction(id, session);
      }}
    >
      <Heart fill="white" className="h-5 w-5" />
      <span className="sr-only">Remove from Watchlist</span>
    </Button>
  );
};
