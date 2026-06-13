import z from "zod";

const requiredId = z.coerce.number().int().positive()

export const personCreateBodySchema = z.object({
  name: z.string().min(1),
  photo_id: requiredId,
  avatar_id: requiredId
})

export const personIdSchema = z.object({ id: z.string() })

export const patchPersonBodySchema = personCreateBodySchema.partial()
