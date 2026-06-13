import z from "zod";

export const photoCreateBodySchema = z.object({
  album_id: z.coerce.number().int().positive().nullish(),
  caption: z.string().nullish(),
  taken_at: z.string().nullish()
})

export const photoCreateFileSchema = z.object({
  originalname: z.string().min(1).max(255),
  filename: z.string().min(1).max(255),
  size: z.number().int().positive()
})

export const photoIdSchema = z.object({ id: z.string() })

export const photoSchema = z.union(photoCreateBodySchema, photoIdSchema, z.object({
  hash: z.string().min(1),
  name: z.string().min(1).max(255),
  size_bytes: z.number().int().nonnegative()
}))

export const patchPhotoBodySchema = photoCreateBodySchema.partial()