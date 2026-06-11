const dialog = document.querySelector('.add-dialog')

document.querySelector('.add-btn').addEventListener('click', () => {
  dialog.showModal()
})
document.querySelector('.close-btn').addEventListener('click', () => {
  dialog.close()
})

document.querySelector('.submit-btn').addEventListener('click', async () => {
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

  dialog.close()
})

