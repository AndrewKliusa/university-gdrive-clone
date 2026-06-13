const personsById = {}
const photosById = {}

loadPeople()

document.querySelector('.filter-apply-btn').addEventListener('click', () => loadPeople())

document.querySelector('.add-person-btn').addEventListener('click', () => {
  addDialog.showModal()
})

document.querySelector('.submit-btn.add').addEventListener('click', async (event) => {
  const form = document.querySelector('.add-form')
  const data = new FormData(form)

  const [response, error] = await catchError(fetch('http://localhost:3000/people', {
    method: 'POST',
    body: data
  }))

  if (error || !response.ok) return alert("Failed to add your person: " + (error ? error.stack : response.status))

  const responseData = await response.json()
  addPerson(responseData)

  addDialog.close()
})

document.querySelector('.people-grid').addEventListener('click', async (event) => {
  const wrapper = event.target.closest('.avatar-name-wrapper')
  if (!wrapper) return

  if (event.target.closest('.edit-overlay')) {
    const form = editDialog.querySelector('.edit-form')
    form.id = "target-" + wrapper.id

    const personData = personsById[wrapper.id]
    form.querySelector('[name="name"]').value = personData.name ?? ''
    form.querySelector('[name="avatar_id"]').value = personData.avatar_id ?? ''
    form.querySelector('[name="photo_id"]').value = personData.photo_id ?? ''

    editDialog.showModal()
  } else if (event.target.closest('.delete-overlay')) {
    wrapper.remove()

    const [response, error] = await catchError(fetch(`http://localhost:3000/people/${wrapper.id}`, {
      method: 'DELETE',
    }))

    if (error || !response.ok) return alert("Failed to delete your person: " + (error ? error.stack : response.status))
  }
})

document.querySelector('.submit-btn.edit').addEventListener('click', async (event) => {
  const form = document.querySelector('.edit-form')
  const data = new FormData(form)
  const personId = form.id.split('-')[1]

  const [response, error] = await catchError(fetch(`http://localhost:3000/people/${personId}`, {
    method: 'PATCH',
    body: data
  }))

  if (error || !response.ok) return alert("Failed to edit your person: " + (error ? error.stack : response.status))

  editDialog.close()
  location.reload()
})

function addPerson(personData) {
  personsById[personData.id] = personData
  const avatar = personData.avatar_id && photosById[personData.avatar_id]
  const avatarSrc = avatar
    ? `http://localhost:3000/uploads/${avatar.hash}`
    : 'resources/cat_cropped.png'
  const addBtn = document.querySelector('.add-person-btn')

  addBtn.insertAdjacentHTML('beforebegin', `
    <div class="avatar-name-wrapper" id="${personData.id}">
      <div class="image-and-overlay">
        <div class="overlay-buttons">
          <span class="edit-overlay">✏️</span>
          <span class="delete-overlay">🗑️</span>
        </div>
        <img class="person-image" src="${avatarSrc}">
      </div>
      <span>${personData.name}</span>
    </div>
  `)
}

async function loadPeople() {
  if (!Object.keys(photosById).length) {
    const [photosRes, photosErr] = await catchError(fetch('http://localhost:3000/photos', {
      method: 'GET',
    }))

    if (photosErr || !photosRes.ok) return alert("Failed to load photos: " + (photosErr ? photosErr.stack : photosRes.status))

    const photosData = await photosRes.json()
    photosData.forEach(photo => { photosById[photo.id] = photo })

    const options = Object.values(photosById)
      .map(photo => `<option value="${photo.id}">${photo.name}</option>`)
      .join('')

    document.querySelectorAll('select[name="photo_id"], select[name="avatar_id"]').forEach(select => {
      select.innerHTML = `<option value="">Choose a photo…</option>${options}`
    })
  }

  const search = document.querySelector('[name="filter_search"]').value.trim()
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  const query = params.toString()

  document.querySelectorAll('.avatar-name-wrapper').forEach(el => el.remove())

  const [response, error] = await catchError(fetch(`http://localhost:3000/people${query ? `?${query}` : ''}`, {
    method: 'GET',
  }))

  if (error || !response.ok) return alert("Failed to load your people: " + (error ? error.stack : response.status))

  const responseData = await response.json()
  responseData.forEach(addPerson)
}
