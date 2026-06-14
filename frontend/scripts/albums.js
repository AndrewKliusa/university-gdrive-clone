const albumsById = {}
const photosByAlbumId = {}

const getModes = setupEditDeleteModes()

seedReady.then(loadAlbums)

document.querySelector('.filter-apply-btn').addEventListener('click', loadAlbums)

document.querySelector('.submit-btn.add').addEventListener('click', async () => {
  const form = document.querySelector('.add-form')
  const data = new FormData(form)

  const response = await fetchRequest(fetch(`${apiUrl}/albums`, {
    method: 'POST',
    body: data
  }), 'create your album')
  if (!response) return

  const responseData = await response.json()
  addAlbum(responseData)

  addDialog.close()
})

document.querySelector('.grid').addEventListener('click', async (event) => {
  const card = event.target.closest('.card')
  if (!card) return

  const { editModeActive, deleteModeActive } = getModes()

  if (editModeActive) {
    const form = editDialog.querySelector('.edit-form')
    form.id = "target-" + card.id

    const albumData = albumsById[card.id]
    form.querySelector('[name="name"]').value = albumData.name ?? ''
    form.querySelector('[name="color"]').value = albumData.color ?? '#dbeafe'
    form.querySelector('[name="description"]').value = albumData.description ?? ''

    editDialog.showModal()
  } else if (deleteModeActive) {
    const response = await fetchRequest(fetch(`${apiUrl}/albums/${card.id}`, {
      method: 'DELETE',
    }), 'delete your album')
    if (!response) return

    card.remove()
    delete albumsById[card.id]
  }
})

document.querySelector('.submit-btn.edit').addEventListener('click', async () => {
  const form = document.querySelector('.edit-form')
  const data = new FormData(form)
  const albumId = form.id.split('-')[1]

  const response = await fetchRequest(fetch(`${apiUrl}/albums/${albumId}`, {
    method: 'PATCH',
    body: data
  }), 'edit your album')
  if (!response) return

  editDialog.close()
  await loadAlbums()
})

function addAlbum(albumData) {
  albumsById[albumData.id] = albumData

  const albumPhotos = photosByAlbumId[albumData.id] ?? []

  const picked = albumPhotos.slice().sort(() => Math.random() - 0.5).slice(0, 3)
  const srcs = picked.map(photo => uploadUrl(photo.hash))

  while (srcs.length < 3) srcs.push(placeholder)

  const imagesHtml = srcs.map(src => `<img class="album-image" src="${src}">`).join('')
  const cardsGrid = document.querySelector(".grid")

  const totalBytes = albumPhotos.reduce((sum, photo) => sum + (photo.size_bytes ?? 0), 0)
  const sizeText = `${(totalBytes / (1024 * 1024)).toFixed(1)}MB`

  cardsGrid.innerHTML += `
    <div class="card" id="${albumData.id}" style="background-color: ${albumData.color}">
      <div class="top-text-wrapper">
        <span class="date-text">${sizeText}</span>
        <span class="album-text">${albumData.name}</span>
        <span class="date-text">${albumPhotos.length} photos</span>
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
  for (const id of Object.keys(albumsById)) delete albumsById[id]

  const photosRes = await fetchRequest(fetch(`${apiUrl}/photos`, {
    method: 'GET',
  }), 'load photos')
  if (!photosRes) return

  const photosData = await photosRes.json()
  for (const id of Object.keys(photosByAlbumId)) delete photosByAlbumId[id]

  photosData.forEach(photo => {
    if (!photo.album_id) return
    if (!photosByAlbumId[photo.album_id]) photosByAlbumId[photo.album_id] = []
    photosByAlbumId[photo.album_id].push(photo)
  })

  const response = await fetchRequest(fetch(`${apiUrl}/albums${query ? `?${query}` : ''}`, {
    method: 'GET',
  }), 'load albums')
  if (!response) return

  const responseData = await response.json()
  responseData.forEach(addAlbum)
}
