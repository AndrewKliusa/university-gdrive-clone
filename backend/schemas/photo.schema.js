import z from "zod";

const optionalId = z.preprocess(
  (val) => val === '' ? undefined : val,
  z.coerce.number().int().positive().nullish()
)

const peopleIds = z.preprocess(
  (val) => val === '' || val == null ? [] : Array.isArray(val) ? val : [val],
  z.array(z.coerce.number().int().positive()).default([])
)

export const photoCreateBodySchema = z.object({
  album_id: optionalId,
  caption: z.string().nullish(),
  taken_at: z.string().nullish(),
  people: peopleIds
})

export const photoCreateFileSchema = z.object({
  originalname: z.string().min(1).max(255),
  filename: z.string().min(1).max(255),
  size: z.number().int().positive()
})

export const photoIdSchema = z.object({ id: z.string() })

export const patchPhotoBodySchema = photoCreateBodySchema.partial()

const optionalDate = z.preprocess(
  (val) => val === '' || val == null ? undefined : val,
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
)

export const photoListQuerySchema = z.object({
  album_id: optionalId,
  person_id: optionalId,
  from: optionalDate,
  to: optionalDate
})