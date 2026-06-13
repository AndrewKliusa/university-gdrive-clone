function addPhoto(photoData) {
  const cardsGrid = document.querySelector(".grid")
  cardsGrid.innerHTML += `
    <div class="card photo-hover">
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
  const response = await fetch('http://localhost:3000/photos', {
    method: 'GET',
  });

  if (!response.ok) {
    alert(`Couldn't retrieve photos: ${response.status}`);
    return;
  }

  const responseData = await response.json()
  for (const photo of responseData) {
    console.log(photo)
  }
}

document.querySelector('.submit-btn').addEventListener('click', async (event) => {
  const form = document.querySelector('.add-form')
  const data = new FormData(form)

  const response = await fetch('http://localhost:3000/photos', {
    method: 'POST',
    body: data
  });
  
  if (!response.ok) {
    alert(`Upload failed: ${response.status}`);
    return;
  }

  const responseData = await response.json()
  addPhoto(responseData)

  dialog.close()
})

loadPhotos()