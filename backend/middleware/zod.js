export const validate = (schema) => (req, res, next) => {
  try {
    if (schema.body) req.body = schema.body.parse(req.body)
    if (schema.params) req.params = schema.params.parse(req.params)
    if (schema.file) req.file = schema.file.parse(req.file)
    if (schema.query) req.filters = schema.query.parse(req.query)

    next()
  } catch (err) {
    if (err.issues) {
      err.status = 400
      err.message = "Validation error"
    }
    next(err)
  }
}