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

function addClassToCardsIf(condition, className) {
  const grid = document.querySelector('.grid');
  const cards = [...grid.children];

  if (condition) {
    cards.forEach((card) => card.classList.add(className));
  } else {
    cards.forEach((card) => card.classList.remove(className));
  }
}