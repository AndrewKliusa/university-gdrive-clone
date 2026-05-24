export const validate = (schema) => (req, res, next) => {
  if (schema.body) req.body = schema.body.parse(req.body)
  next()
}