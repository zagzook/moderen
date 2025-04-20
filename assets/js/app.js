import { CONSTANT } from './constant.js'

const dark_mode = document.querySelector('#dark-mode-toggle')
const body = document.body
const logo_image = document.querySelector('#nav-logo-img')
const logo_dark = './assets/images/logos/Logo-Dark.png'
const logo_light = './assets/images/logos/Logo-Light.png'

// dark mode toggle
dark_mode.addEventListener('click', () => {
  body.classList.toggle('dark')
  const is_dark_mode = body.classList.contains('dark')
  localStorage.setItem('darkMode', is_dark_mode)
  //   change mobile bar color
  document
    .querySelector('meta[name="theme-color"')
    .setAttribute('content', is_dark_mode ? '#1a1a2e' : '#fff')
  logo_image.src = is_dark_mode ? logo_dark : logo_light
})

// inital value
const name_input = document.querySelector('#input-name')
const start_screen = document.querySelector('#start-screen')

let cells

let mode_index = 0
let mode = CONSTANT.MODE_INDEX[mode_index]

let grid_index = 0
let grid = CONSTANT.GRID_INDEX[grid_index]

let game_type_index = 0
let game_type = CONSTANT.GAME_TYPE_INDEX[game_type_index]

let level_index = 0
let level = CONSTANT.LEVEL_INDEX[level_index]

//---------------------

// addEventListener
document.querySelector('#btn-mode').addEventListener('click', (e) => {
  mode_index =
    mode_index + 1 > CONSTANT.MODE_INDEX.length - 1 ? 0 : mode_index + 1
  mode = CONSTANT.MODE_INDEX[mode_index]
  e.target.innerHTML = CONSTANT.MODE_NAME[mode_index]
})

document.querySelector('#btn-grid').addEventListener('click', (e) => {
  grid_index =
    grid_index + 1 > CONSTANT.GRID_INDEX.length - 1 ? 0 : grid_index + 1
  grid = CONSTANT.GRID_INDEX[grid_index]
  e.target.innerHTML = CONSTANT.GRID_NAME[grid_index]
})

document.querySelector('#btn-game-type').addEventListener('click', (e) => {
  game_type_index =
    game_type_index + 1 > CONSTANT.GAME_TYPE_INDEX.length - 1
      ? 0
      : game_type_index + 1
  game_type = CONSTANT.GAME_TYPE_INDEX[game_type_index]
  e.target.innerHTML = CONSTANT.GAME_TYPE_NAME[game_type_index]
})

document.querySelector('#btn-level').addEventListener('click', (e) => {
  level_index =
    level_index + 1 > CONSTANT.LEVEL_INDEX.length - 1 ? 0 : level_index + 1
  level = CONSTANT.LEVEL_INDEX[level_index]
  e.target.innerHTML = CONSTANT.LEVEL_NAME[level_index]
})

document.querySelector('#btn-play').addEventListener('click', () => {
  if (name_input.value.length > 0) {
    alert(`Level => ${CONSTANT.LEVEL_NAME[level_index]}`)
  } else {
    name_input.classList.add('input-err')
    setTimeout(() => {
      name_input.classList.remove('input-err')
      name_input.focus()
    }, 500)
  }
})

const getGameInfo = () => JSON.parse(localStorage.getItem('game'))

// Add space for each 9 cell block
function initGameGrid() {
  let index = 0
  for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
    let row = Math.floor(i / CONSTANT.GRID_SIZE)
    let col = i % CONSTANT.GRID_SIZE
    if (row === 2 || row === 5) cells[index].style.marginBottom = '10px'
    if (col === 2 || col === 5) cells[index].style.marginRight = '10px'
    index++
  }
}
// ---------------
const init = () => {
  const is_dark_mode = JSON.parse(localStorage.getItem('darkMode'))
  body.classList.toggle(is_dark_mode ? 'dark' : 'light')
  document
    .querySelector('meta[name="theme-color"')
    .setAttribute('content', is_dark_mode ? '#1a1a2e' : '#fff')
  logo_image.src = is_dark_mode ? logo_dark : logo_light

  const game = getGameInfo()

  document.querySelector('#btn-continue').style.display = game ? 'grid' : 'none'
  setGameGrid(CONSTANT.GRID_SIZE)
  initGameGrid()
}

function setGameGrid(grid) {
  for (let row = 0; row < grid; row++) {
    for (let col = 0; col < grid; col++) {
      let tile = document.createElement('div')
      tile.id = `${row}-${col}`
      tile.classList.add('main-grid-cell')
      tile.innerHTML = row
      document.getElementById('main-sudoku-grid').append(tile)
    }
  }
  cells = document.querySelectorAll('.main-grid-cell')
}

init()
