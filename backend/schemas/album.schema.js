import z from "zod";

export const albumCreateBodySchema = z.object({
  name: z.string().min(1),
  color: z.string().nullish(),
  description: z.string().nullish()
})

export const albumIdSchema = z.object({ id: z.string() })

export const patchAlbumBodySchema = albumCreateBodySchema.partial()

const optionalSearch = z.preprocess(
  (val) => val === '' || val == null ? undefined : val,
  z.string().trim().min(1).optional()
)

export const albumListQuerySchema = z.object({
  search: optionalSearch
})
