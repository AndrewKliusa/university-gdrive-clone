const dialog = document.querySelector('.add-dialog')

document.querySelector('.add-btn').addEventListener('click', () => {
  dialog.showModal()
})
document.querySelector('.close-btn').addEventListener('click', () => {
  dialog.close()
})