const addDialog = document.querySelector('.add-dialog')
const editDialog = document.querySelector('.edit-dialog')

const addBtn = document.querySelector('.add-btn')
if (addBtn) {
  addBtn.addEventListener('click', () => {
    addDialog.showModal()
  })
}

const closeAddBtn = document.querySelector('.close-btn.add')
if (closeAddBtn) {
  closeAddBtn.addEventListener('click', () => {
    addDialog.close()
  })
}

const closeEditBtn = document.querySelector('.close-btn.edit')
if (closeEditBtn) {
  closeEditBtn.addEventListener('click', () => {
    editDialog.close()
  })
}

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