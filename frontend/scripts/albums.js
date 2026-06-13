let editModeActive = false;
let deleteModeActive = false;

const albumsById = {}
const photosByAlbumId = {}

loadAlbums()

document.querySelector('.filter-apply-btn').addEventListener('click', () => loadAlbums())

document.querySelector('.submit-btn.add').addEventListener('click', async (event) => {
  const form = document.querySelector('.add-form')
  const data = new FormData(form)

  const [response, error] = await catchError(fetch('http://localhost:3000/albums', {
    method: 'POST',
    body: data
  }))

  if (error || !response.ok) return alert("Failed to upload your album: " + (error ? error.stack : response.status))

  const responseData = await response.json()
  addAlbum(responseData)

  addDialog.close()
})

document.querySelector('.grid').addEventListener('click', async (event) => {
  const card = event.target.closest('.card')
  if (!card) return

  if (editModeActive) {
    const form = editDialog.querySelector('.edit-form')
    form.id = "target-" + card.id

    const albumData = albumsById[card.id]
    form.querySelector('[name="name"]').value = albumData.name ?? ''
    form.querySelector('[name="color"]').value = albumData.color ?? '#dbeafe'
    form.querySelector('[name="description"]').value = albumData.description ?? ''

    editDialog.showModal()
  } else if (deleteModeActive) {
    card.remove()

    const [response, error] = await catchError(fetch(`http://localhost:3000/albums/${card.id}`, {
      method: 'DELETE',
    }))

    if (error || !response.ok) return alert("Failed to delete your album: " + (error ? error.stack : response.status))
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
  const albumId = form.id.split('-')[1]

  const [response, error] = await catchError(fetch(`http://localhost:3000/albums/${albumId}`, {
    method: 'PATCH',
    body: data
  }))

  if (error || !response.ok) return alert("Failed to edit your album: " + (error ? error.stack : response.status))

  editDialog.close()
  location.reload()
})

document.querySelector('.remove-btn').addEventListener('click', async (event) => {
  deleteModeActive = !deleteModeActive
  if (deleteModeActive) editModeActive = false

  addClassToCardsIf(editModeActive, "edit-hover")
  addClassToCardsIf(deleteModeActive, "remove-hover")
})

function addAlbum(albumData) {
  albumsById[albumData.id] = albumData

  const albumPhotos = photosByAlbumId[albumData.id] ?? []
  const picked = albumPhotos.slice().sort(() => Math.random() - 0.5).slice(0, 3)
  const srcs = picked.map(photo => `http://localhost:3000/uploads/${photo.hash}`)
  while (srcs.length < 3) srcs.push('resources/cat_cropped.png')

  const imagesHtml = srcs.map(src => `<img class="album-image" src="${src}">`).join('')
  const cardsGrid = document.querySelector(".grid")

  cardsGrid.innerHTML += `
    <div class="card" id="${albumData.id}" style="background-color: ${albumData.color}">
      <div class="top-text-wrapper">
        <span class="date-text">${albumPhotos.length} photos</span>
        <span class="album-text">${albumData.name}</span>
        <span class="date-text">10MB size</span>
      </div> 
      <div class="album-images-wrapper">
        ${imagesHtml}
      </div>
    </div>
  `
}

async function loadAlbums() {
  const search = document.querySelector('[name="filter_search"]').value.trim()
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  const query = params.toString()

  document.querySelector('.grid').innerHTML = ''

  const [photosRes, photosErr] = await catchError(fetch('http://localhost:3000/photos', {
    method: 'GET',
  }))

  if (photosErr || !photosRes.ok) return alert("Failed to load photos: " + (photosErr ? photosErr.stack : photosRes.status))

  const photosData = await photosRes.json()
  for (const id of Object.keys(photosByAlbumId)) delete photosByAlbumId[id]
  photosData.forEach(photo => {
    if (!photo.album_id) return
    if (!photosByAlbumId[photo.album_id]) photosByAlbumId[photo.album_id] = []
    photosByAlbumId[photo.album_id].push(photo)
  })

  const [response, error] = await catchError(fetch(`http://localhost:3000/albums${query ? `?${query}` : ''}`, {
    method: 'GET',
  }))

  if (error || !response.ok) return alert("Failed to load albums: " + (error ? error.stack : response.status))

  const responseData = await response.json()
  responseData.forEach(addAlbum)
}
