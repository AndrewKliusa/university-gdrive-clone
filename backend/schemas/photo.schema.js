import z from "zod";

export const photoSchema = z.object({
  album_id: z.number().int().positive().nullish(),
  name: z.string().min(1).max(255),
  hash: z.string().min(1),
  size_bytes: z.number().int().nonnegative(),
  caption: z.string().nullish(),
  taken_at: z.string().nullish()
})