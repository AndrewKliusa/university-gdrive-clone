let editModeActive = false;
let deleteModeActive = false;

const photosById = {}
const albumsById = {}

loadPhotos()

document.querySelector('.submit-btn.add').addEventListener('click', async (event) => {
  const form = document.querySelector('.add-form')
  const data = new FormData(form)

  const [response, error] = await catchError(fetch('http://localhost:3000/photos', {
    method: 'POST',
    body: data
  }))

  if (error || !response.ok) return alert("Failed to upload your photo: " + (error ? error.stack : response.status))

  const responseData = await response.json()
  addPhoto(responseData)

  addDialog.close()
})

document.querySelector('.grid').addEventListener('click', async (event) => {
  const card = event.target.closest('.card')
  if (!card) return

  if (editModeActive) {
    const form = editDialog.querySelector('.edit-form')
    form.id = "target-" + card.id

    const photoData = photosById[card.id]
    form.querySelector('[name="taken_at"]').value = photoData.taken_at ?? ''
    form.querySelector('[name="album_id"]').value = photoData.album_id ?? ''
    form.querySelector('[name="caption"]').value = photoData.caption ?? ''

    editDialog.showModal()
  } else if (deleteModeActive) {
    card.remove()

    const [response, error] = await catchError(fetch(`http://localhost:3000/photos/${card.id}`, {
      method: 'DELETE',
    }))

    if (error || !response.ok) return alert("Failed to delete your photo: " + (error ? error.stack : response.status))
  }  
})

document.querySelector('.edit-btn').addEventListener('click', async (event) => {
  editModeActive = !editModeActive
  if (editModeActive) deleteModeActive = false

  addClassToCardsIf(editModeActive, "edit-hover")
  addClassToCardsIf(deleteModeActive, "remove-hover")
})

document.querySelector('.submit-btn.edit').addEventListener('click', async (event) => {
  const form = document.querySelector('.edit-form')
  const data = new FormData(form)
  const photoId = form.id.split('-')[1]

  const [response, error] = await catchError(fetch(`http://localhost:3000/photos/${photoId}`, {
    method: 'PATCH',
    body: data
  }))

  if (error || !response.ok) return alert("Failed to edit your photo: " + (error ? error.stack : response.status))

  editDialog.close()
  location.reload()
})

document.querySelector('.remove-btn').addEventListener('click', async (event) => {
  deleteModeActive = !deleteModeActive
  if (deleteModeActive) editModeActive = false

  addClassToCardsIf(editModeActive, "edit-hover")
  addClassToCardsIf(deleteModeActive, "remove-hover")
})

function addPhoto(photoData) {
  photosById[photoData.id] = photoData

  const album = photoData.album_id && albumsById[photoData.album_id]
  const albumHtml = album
    ? `<span class="album-text" style="background-color: ${album.color ?? '#dbeafe'}">${album.name}</span>`
    : ''
  const cardsGrid = document.querySelector(".grid")

  cardsGrid.innerHTML += `
    <div class="card photo-hover" id="${photoData.id}">
      <div class="photo-top">
        <span class="date-text">${photoData.created_at}</span>
        <div class="people-images-wrapper">
          <img class="person-image" src="resources/test_cropped.jpg">
          <img class="person-image" src="resources/cat_cropped.png">
          <img class="person-image" src="resources/cat_cropped.png">
          <img class="person-image" src="resources/cat_cropped.png">
          <img class="person-image" src="resources/cat_cropped.png">
        </div>
        ${albumHtml}
      </div>
      <img class="main-image" src="http://localhost:3000/uploads/${photoData.hash}">
      <span class="card-caption">${photoData.caption}</span>
    </div>
  `
}

async function loadPhotos() {
  const [albumsRes, albumsErr] = await catchError(fetch('http://localhost:3000/albums', {
    method: 'GET',
  }))

  if (albumsErr || !albumsRes.ok) return alert("Failed to load albums: " + (albumsErr ? albumsErr.stack : albumsRes.status))

  const albumsData = await albumsRes.json()
  albumsData.forEach(album => { albumsById[album.id] = album })

  const options = Object.values(albumsById)
    .map(album => `<option value="${album.id}">${album.name}</option>`)
    .join('')

  document.querySelectorAll('select[name="album_id"]').forEach(select => {
    select.innerHTML = `<option value="">Choose an album…</option>${options}`
  })

  const [response, error] = await catchError(fetch('http://localhost:3000/photos', {
    method: 'GET',
  }))

  if (error || !response.ok) return alert("Failed to upload your photo: " + (error ? error.stack : response.status))

  const responseData = await response.json()
  responseData.forEach(addPhoto)
}