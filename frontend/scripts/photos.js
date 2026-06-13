let editModeActive = false;
let deleteModeActive = false;

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
    editDialog.querySelector('.edit-form').id += card.id
    editDialog.showModal()
  } else if (deleteModeActive) {
    card.remove()
    await removePhoto(card.id)
  }  
})

document.querySelector('.edit-btn').addEventListener('click', async (event) => {
  editModeActive = !editModeActive

  addClassToCardsIf(deleteModeActive, "edit-hover");
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

  const responseData = await response.json()

  editDialog.close()
  location.reload()
})

document.querySelector('.remove-btn').addEventListener('click', async (event) => {
  deleteModeActive = !deleteModeActive

  addClassToCardsIf(deleteModeActive, "remove-hover");
})

function addPhoto(photoData) {
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
        <span class="album-text">My Home</span>
      </div>
      <img class="main-image" src="http://localhost:3000/uploads/${photoData.hash}">
      <span class="card-caption">${photoData.caption}</span>
    </div>
  `
}

async function loadPhotos() {
  const [response, error] = await catchError(fetch('http://localhost:3000/photos', {
    method: 'GET',
  }))

  if (error || !response.ok) return alert("Failed to upload your photo: " + (error ? error.stack : response.status))

  const responseData = await response.json()
  responseData.forEach(addPhoto)
}

async function removePhoto(cardId) {
  const [response, error] = await catchError(fetch(`http://localhost:3000/photos/${cardId}`, {
    method: 'DELETE',
  }))

  if (error || !response.ok) return alert("Failed to delete your photo: " + (error ? error.stack : response.status))
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