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

async function apiError(response) {
  try {
    const body = await response.json()
    if (body.error) return body.error
  } catch {}
  return 'Something went wrong. Please try again.'
}

async function fetchRequest(promise, action) {
  try {
    const response = await promise
    if (!response.ok) {
      alert(`Failed to ${action}: ${await apiError(response)}`)
      return null
    }
    return response
  } catch (err) {
    alert(`Failed to ${action}: ${err.message}`)
    return null
  }
}

function addClassToCardsIf(condition, className) {
  const grid = document.querySelector('.grid');
  const cards = [...grid.children];

  if (condition) {
    cards.forEach((card) => card.classList.add(className));
  } else {
    cards.forEach((card) => card.classList.remove(className));
  }
}
