let editModeActive = false;
let deleteModeActive = false;

const albumsById = {}

loadAlbums()

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
  const cardsGrid = document.querySelector(".grid")
  
  cardsGrid.innerHTML += `
    <div class="card" id="${albumData.id}" style="background-color: ${albumData.color}">
      <div class="top-text-wrapper">
        <span class="date-text">3 photos</span>
        <span class="album-text">${albumData.name}</span>
        <span class="date-text">10MB size</span>
      </div> 
      <div class="album-images-wrapper">
        <img class="album-image" src="resources/test_cropped.jpg">
        <img class="album-image" src="resources/cat_cropped.png">
        <img class="album-image" src="resources/cat_cropped.png">
      </div>
    </div>
  `
}

async function loadAlbums() {
  const [response, error] = await catchError(fetch('http://localhost:3000/albums', {
    method: 'GET',
  }))

  if (error || !response.ok) return alert("Failed to upload your album: " + (error ? error.stack : response.status))

  const responseData = await response.json()
  responseData.forEach(addAlbum)
}