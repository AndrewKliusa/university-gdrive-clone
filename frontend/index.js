const dialog = document.getElementById('add-dialog');
document.querySelector('.add-btn').addEventListener('click', () => {
  dialog.showModal();
});
document.querySelector('.close-dialog').addEventListener('click', () => {
  dialog.close();
});