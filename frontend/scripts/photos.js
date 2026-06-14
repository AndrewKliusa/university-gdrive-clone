const photosById = {}
const albumsById = {}
const personsById = {}

const getModes = setupEditDeleteModes()

seedReady.then(loadPhotos)

document.querySelector('.filter-apply-btn').addEventListener('click', fetchPhotos)

document.querySelector('.submit-btn.add').addEventListener('click', async () => {
  const form = document.querySelector('.add-form')
  const data = new FormData(form)

  const response = await fetchRequest(fetch(`${apiUrl}/photos`, {
    method: 'POST',
    body: data
  }), 'upload your photo')
  if (!response) return

  const responseData = await response.json()
  addPhoto(responseData)

  addDialog.close()
})

document.querySelector('.grid').addEventListener('click', async (event) => {
  const card = event.target.closest('.card')
  if (!card) return

  const { editModeActive, deleteModeActive } = getModes()

  if (editModeActive) {
    const form = editDialog.querySelector('.edit-form')
    form.id = "target-" + card.id

    const photoData = photosById[card.id]
    form.querySelector('[name="taken_at"]').value = photoData.taken_at ?? ''
    form.querySelector('[name="album_id"]').value = photoData.album_id ?? ''
    form.querySelector('[name="caption"]').value = photoData.caption ?? ''

    const select = form.querySelector('[name="people"]')
    const ids = photoData.people_ids ?? []

    for (const opt of select.options) {
      opt.selected = ids.includes(Number(opt.value))
    }

    editDialog.showModal()
  } else if (deleteModeActive) {
    const response = await fetchRequest(fetch(`${apiUrl}/photos/${card.id}`, {
      method: 'DELETE',
    }), 'delete your photo')
    if (!response) return

    card.remove()
    delete photosById[card.id]
  }
})

document.querySelector('.submit-btn.edit').addEventListener('click', async () => {
  const form = document.querySelector('.edit-form')
  const data = new FormData(form)
  const photoId = form.id.split('-')[1]

  const response = await fetchRequest(fetch(`${apiUrl}/photos/${photoId}`, {
    method: 'PATCH',
    body: data
  }), 'edit your photo')
  if (!response) return

  editDialog.close()
  await fetchPhotos()
})

function addPhoto(photoData) {
  photosById[photoData.id] = photoData

  const album = photoData.album_id && albumsById[photoData.album_id]
  const albumHtml = album
    ? `<span class="album-text" style="background-color: ${album.color ?? '#dbeafe'}">${album.name}</span>`
    : ''
    
  const peopleHtml = (photoData.people_ids ?? [])
    .map(id => getAvatarSrc(personsById[id], photosById))
    .map(src => `<img class="person-image" src="${src}">`)
    .join('')

  const [year, month, day] = (photoData.taken_at ?? '').split('-')
  const dateText = day ? `${day}.${month}.${year.slice(2)}` : photoData.created_at
  const cardsGrid = document.querySelector(".grid")

  cardsGrid.innerHTML += `
    <div class="card photo-hover" id="${photoData.id}">
      <div class="photo-top">
        <span class="date-text">${dateText}</span>
        <div class="people-images-wrapper">
          ${peopleHtml}
        </div>
        ${albumHtml}
      </div>
      <img class="main-image" src="${uploadUrl(photoData.hash)}">
      <span class="card-caption">${photoData.caption}</span>
    </div>
  `
}

async function fetchPhotos() {
  const bar = document.querySelector('.filter-bar')
  const params = new URLSearchParams()
  const albumId = bar.querySelector('[name="filter_album_id"]').value
  const personId = bar.querySelector('[name="filter_person_id"]').value
  const from = bar.querySelector('[name="filter_from"]').value
  const to = bar.querySelector('[name="filter_to"]').value

  if (albumId) params.set('album_id', albumId)
  if (personId) params.set('person_id', personId)
  if (from) params.set('from', from)
  if (to) params.set('to', to)

  const query = params.toString()

  document.querySelector('.grid').innerHTML = ''
  for (const id of Object.keys(photosById)) delete photosById[id]

  const response = await fetchRequest(fetch(`${apiUrl}/photos${query ? `?${query}` : ''}`, {
    method: 'GET',
  }), 'load photos')
  if (!response) return

  const responseData = await response.json()
  responseData.forEach(photo => { photosById[photo.id] = photo })
  responseData.forEach(addPhoto)
}

async function loadPhotos() {
  const albumsRes = await fetchRequest(fetch(`${apiUrl}/albums`, {
    method: 'GET',
  }), 'load albums')
  if (!albumsRes) return

  const albumsData = await albumsRes.json()
  albumsData.forEach(album => { albumsById[album.id] = album })

  const albumOptions = Object.values(albumsById)
    .map(album => `<option value="${album.id}">${album.name}</option>`)
    .join('')

  document.querySelectorAll('select[name="album_id"]').forEach(select => {
    select.innerHTML = `<option value="">Choose an album…</option>${albumOptions}`
  })

  document.querySelector('[name="filter_album_id"]').innerHTML = `<option value="">All albums</option>${albumOptions}`

  const peopleRes = await fetchRequest(fetch(`${apiUrl}/people`, {
    method: 'GET',
  }), 'load people')
  if (!peopleRes) return

  const peopleData = await peopleRes.json()
  peopleData.forEach(person => { personsById[person.id] = person })

  const peopleOptions = Object.values(personsById)
    .map(person => `<option value="${person.id}">${person.name}</option>`)
    .join('')

  document.querySelectorAll('select[name="people"]').forEach(select => {
    select.innerHTML = peopleOptions
  })

  document.querySelector('[name="filter_person_id"]').innerHTML = `<option value="">All people</option>${peopleOptions}`

  await fetchPhotos()
}
