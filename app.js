// Options
const fieldSize = 16
const minesFraction = 0.11

const container = document.getElementById('app')

const getRandomInteger = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const setupStyles = (fieldSize) => {
  document.documentElement.style.setProperty('--field-size', fieldSize)
}

const setupListeners = (container, field) => {
  container.addEventListener('click', (evt) => handleClick(evt, container, field))
}

const handleClick = (evt, container, field) => {
  const cell = evt.target
  const row = parseInt(cell.dataset.row)
  const column = parseInt(cell.dataset.column)
  if (isNaN(row) || isNaN(column)) return

  convertCell(field, row, column)
  if (hasWon(field)) alert('You won!')
  if (hasLost(field)) {
    explodeBombs(field)
    alert('You lost!')
  }
  renderField(container, field)
}

const hasWon = (field) => {
  return field.every(row =>(
    row.every(cell =>
      Number.isInteger(cell) || cell === 'o'
    )
  ))
}

const hasLost = (field) => {
  return field.some(row => (
    row.some(cell => cell === '*')
  ))
}

const explodeBombs = field => {
  field.forEach((row, i) => {
    row.forEach((cell, j) => {
      if(cell === 'o') field[i][j] = '*'
    })
  })
}

const convertCell = (field, row, column) => {
  const fieldValue = field[row][column]
  if (Number.isInteger(fieldValue)) return
  const hasBomb = fieldValue === 'o' || fieldValue === '*'

  if (hasBomb) {
    field[row][column] = '*'
  }
  else {
    const bombsCount = countNearBombs(field, row, column)
    field[row][column] = bombsCount
    if (bombsCount === 0) { convertNeighbours(field, row, column) }
  }
}

const convertNeighbours = (field, row, column) => {
  const maxFieldSize = field.length
  if (row - 1 >= 0 && column - 1 >= 0) convertCell(field, row - 1, column - 1)
  if (row - 1 >= 0) convertCell(field, row - 1, column)
  if (row - 1 >= 0 && column + 1 < maxFieldSize) convertCell(field, row - 1, column + 1)
  if (column - 1 >= 0) convertCell(field, row, column - 1)
  if (column + 1 < maxFieldSize) convertCell(field, row, column + 1)
  if (row + 1 < maxFieldSize && column - 1 >= 0) convertCell(field, row + 1, column - 1)
  if (row + 1 < maxFieldSize) convertCell(field, row + 1, column)
  if (row + 1 < maxFieldSize && column + 1 < maxFieldSize) convertCell(field, row + 1, column + 1)
}

const countNearBombs = (field, row, column) => {
  const maxFieldSize = field.length
  let bombs = 0
  if (row - 1 >= 0 && column - 1 >= 0 && field[row - 1][column - 1] === 'o') bombs++
  if (row - 1 >= 0 && field[row - 1][column] === 'o') bombs++
  if (row - 1 >= 0 && column + 1 < maxFieldSize && field[row - 1][column + 1] === 'o') bombs++
  if (column - 1 >= 0 && field[row][column - 1] === 'o') bombs++
  if (column + 1 < maxFieldSize && field[row][column + 1] === 'o') bombs++
  if (row + 1 < maxFieldSize && column - 1 >= 0 && field[row + 1][column - 1] === 'o') bombs++
  if (row + 1 < maxFieldSize && field[row + 1][column] === 'o') bombs++
  if (row + 1 < maxFieldSize && column + 1 < maxFieldSize && field[row + 1][column + 1] === 'o') bombs++
  return bombs
}

const createField = (fieldSize, minesFraction) => {
  const field = []
  for (let i = 0; i < fieldSize; i++) {
    const row = []
    for (let j = 0; j < fieldSize; j++) {
      row.push('?')
    }
    field.push(row)
  }

  const totalCells = fieldSize**2
  const totalMines = Math.floor(totalCells * minesFraction)

  for (let i = 0; i < totalMines; i++) {
    let found = false
    do {
      const row = getRandomInteger(0, fieldSize - 1)
      const column = getRandomInteger(0, fieldSize - 1)
      if (field[row][column] === '?') {
        found = true
        field[row][column] = 'o'
      }
    } while(!found)
  }

  return field
}

const renderField = (container, field) => {
  Array.from(container.children).forEach(child => child.remove())

  field.forEach((row, i) => {
    row.forEach((cell, j) => {
      const cellElement = document.createElement('div')
      cellElement.dataset.row = i
      cellElement.dataset.column = j
      cellElement.classList.add('cell')
      if (cell === '*') {
        cellElement.classList.add('exploded')
      } else if (Number.isInteger(cell)) {
        cellElement.classList.add('selected')

        if (cell !== 0) {
          cellElement.textContent = cell
        }
      }
      container.appendChild(cellElement)
    })
  })
}

const field = createField(fieldSize, minesFraction)

setupStyles(fieldSize)
setupListeners(container, field)
renderField(container, field)
