import { z } from "zod";

export const WatchListItemSchema = z.object({
  name: z.string(),
  imageUrl: z.string(),
  rating: z.number(),
  releaseDate: z.string(),
  duration: z.string().optional(),
  type: z.string(),
});

export const RemoveWatchListItemParamsSchema = z.object({
  id: z.string(),
});

export type TWatchListItemSchema = z.infer<typeof WatchListItemSchema>;
export type TRemoveWatchListItemParamsSchema = z.infer<
  typeof RemoveWatchListItemParamsSchema
>;
