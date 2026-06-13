import z from "zod";

export const personCreateBodySchema = z.object({
  name: z.string().min(1),
  photo_id: z.coerce.number().int().positive().nullish(),
  avatar_id: z.coerce.number().int().positive().nullish()
})

export const personIdSchema = z.object({ id: z.string() })

export const patchPersonBodySchema = personCreateBodySchema.partial()
