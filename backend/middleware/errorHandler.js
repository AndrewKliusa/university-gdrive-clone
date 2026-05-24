export function errorHandler(err, req, res, next) {
  const status = err.status ?? 500
  const body = { error: status === 500 ? "Server error" : err.message }

  if (err.issues) body.issues = err.issues
  if (status === 500) console.log(err)

  res.status(status).json(body)
}