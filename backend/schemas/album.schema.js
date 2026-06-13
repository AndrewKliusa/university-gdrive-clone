import z from "zod"
import { optionalSearch } from "./common.js"

export const albumCreateBodySchema = z.object({
  name: z.string().min(1),
  color: z.string().nullish(),
  description: z.string().nullish()
})

export const albumIdSchema = z.object({ id: z.string() })

export const patchAlbumBodySchema = albumCreateBodySchema.partial()

export const albumListQuerySchema = z.object({
  search: optionalSearch
})
