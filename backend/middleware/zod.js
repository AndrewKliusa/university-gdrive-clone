export const validate = (schema) => (req, res, next) => {
  if (schema.body) req.body = schema.body.parse(req.body)
  if (schema.params) req.params = schema.params.parse(req.params)
  next()
}