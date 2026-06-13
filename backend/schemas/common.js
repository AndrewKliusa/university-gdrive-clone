import z from "zod"

export const optionalSearch = z.preprocess(
  (val) => val === '' || val == null ? undefined : val,
  z.string().trim().min(1).optional()
)
