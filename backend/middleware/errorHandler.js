const fieldLabels = {
  name: 'Name',
  taken_at: 'Photo date',
  caption: 'Description',
  album_id: 'Album',
  photo_id: 'Linked photo',
  avatar_id: 'Avatar photo',
  color: 'Album color',
  description: 'Description',
  search: 'Search',
  from: 'From date',
  to: 'To date',
  person_id: 'Person',
  originalname: 'Photo file',
  filename: 'Photo file',
  size: 'Photo file',
}

function formatZodIssues(issues) {
  return issues.map(issue => {
    const key = issue.path?.[0]
    const label = fieldLabels[key] ?? (key ? String(key).replaceAll('_', ' ') : 'Photo file')

    if (issue.code === 'invalid_type' && (issue.input === undefined || issue.received === 'undefined')) {
      return `${label} is required`
    }
    if (issue.code === 'too_small' && issue.minimum === 1) {
      return `${label} is required`
    }
    return `${label}: ${issue.message}`
  }).join('. ')
}

export function errorHandler(err, req, res, next) {
  const status = err.status ?? 500
  let message = err.message

  if (err.issues?.length) {
    message = formatZodIssues(err.issues)
  } else if (status === 500) {
    message = 'Something went wrong on the server. Please try again.'
  }

  if (status === 500) console.log(err)

  res.status(status).json({ error: message })
}
