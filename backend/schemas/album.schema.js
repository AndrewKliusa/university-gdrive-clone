import z from "zod";

export const albumCreateBodySchema = z.object({
  name: z.string().min(1),
  color: z.string().nullish(),
  description: z.string().nullish()
})

export const albumIdSchema = z.object({ id: z.string() })

export const patchAlbumBodySchema = albumCreateBodySchema.partial()
