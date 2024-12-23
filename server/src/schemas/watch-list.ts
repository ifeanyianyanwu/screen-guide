import { z } from "zod";

export const WatchListItemSchema = z.object({
  name: z.string(),
  imageUrl: z.string(),
  rating: z.number(),
  releaseDate: z.string(),
});

export const RemoveWatchListItemParamsSchema = z.object({
  id: z.string(),
});
