const apiUrl = 'http://localhost:3000'
const placeholder = 'resources/cat_cropped.png'
const uploadUrl = (hash) => `${apiUrl}/uploads/${hash}`

const seedReady = fetch(`${apiUrl}/seed`, { method: 'POST' })

const addDialog = document.querySelector('.add-dialog')
const editDialog = document.querySelector('.edit-dialog')

document.querySelector('.add-btn')?.addEventListener('click', () => {
  addDialog.showModal()
})

document.querySelector('.close-btn.add')?.addEventListener('click', () => {
  addDialog.close()
})

document.querySelector('.close-btn.edit')?.addEventListener('click', () => {
  editDialog.close()
})

function addClassToCardsIf(condition, className) {
  const grid = document.querySelector('.grid')
  if (!grid) return

  const cards = [...grid.children]
  for (const card of cards) {
    card.classList.toggle(className, condition)
  }
}

function setupEditDeleteModes() {
  let editModeActive = false
  let deleteModeActive = false

  document.querySelector('.edit-btn')?.addEventListener('click', () => {
    editModeActive = !editModeActive
    if (editModeActive) deleteModeActive = false

    addClassToCardsIf(editModeActive, 'edit-hover')
    addClassToCardsIf(deleteModeActive, 'remove-hover')
  })

  document.querySelector('.remove-btn')?.addEventListener('click', () => {
    deleteModeActive = !deleteModeActive
    if (deleteModeActive) editModeActive = false

    addClassToCardsIf(editModeActive, 'edit-hover')
    addClassToCardsIf(deleteModeActive, 'remove-hover')
  })

  return () => ({ editModeActive, deleteModeActive })
}

function getAvatarSrc(person, photosById) {
  if (!person) return placeholder

  const avatar = person.avatar_id && photosById[person.avatar_id]
  return avatar ? uploadUrl(avatar.hash) : placeholder
}

async function fetchRequest(promise, action) {
  let response

  try {
    response = await promise
  } catch (err) {
    alert(`Failed to ${action}: ${err.message}`)
    return
  }

  if (response.ok) return response

  const body = await response.json().catch(() => null)
  const message = body?.error ?? 'Something went wrong. Please try again.'

  alert(`Failed to ${action}: ${message}`)
}