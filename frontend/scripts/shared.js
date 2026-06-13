const addDialog = document.querySelector('.add-dialog')
const editDialog = document.querySelector('.edit-dialog')

document.querySelector('.add-btn').addEventListener('click', () => {
  addDialog.showModal()
})

document.querySelector('.close-btn.add').addEventListener('click', () => {
  addDialog.close()
})

document.querySelector('.close-btn.edit').addEventListener('click', () => {
  editDialog.close()
})

async function catchError(input) {
  try {
    const result = typeof input === "function"
      ? await input()
      : await input;

    return [result, null];
  } catch (err) {
    return [null, err];
  }
}
