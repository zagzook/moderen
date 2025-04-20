import { CONSTANT } from './constant.js'

const body = document.body
const dark_mode = document.querySelector('#dark-mode-toggle')
const logo_image = document.querySelector('#nav-logo-img')
const player_name = document.querySelector('#player-name')
const game_level = document.querySelector('#game-level')
const game_timer = document.querySelector('#game-timer')
const todays_date = document.querySelector('#info-date-container')

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

// Screens
const start_screen = document.querySelector('#start-screen')
const game_screen = document.querySelector('#game-screen')
const pause_screen = document.querySelector('#pause-screen')

// inital value
const name_input = document.querySelector('#input-name')
const today = new Date()

let cells

let mode_index = 0
let mode = CONSTANT.MODE_INDEX[mode_index]

let grid_index = 0
let grid = CONSTANT.GRID_INDEX[grid_index]

let game_type_index = 0
let game_type = CONSTANT.GAME_TYPE_INDEX[game_type_index]

let level_index = 1
let level = CONSTANT.LEVEL_INDEX[level_index]

let timer = null
let seconds = 0
let paused = false

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
    startGame()
  } else {
    name_input.classList.add('input-err')
    setTimeout(() => {
      name_input.classList.remove('input-err')
      name_input.focus()
    }, 500)
  }
})

document.querySelector('#main-game-info-home').addEventListener('click', () => {
  returnToStartScreen()
})

document.querySelector('#btn-pause').addEventListener('click', () => {
  let label = document.querySelector('#btn-pause').innerHTML

  if (label === 'Resume') {
    pause_screen.classList.remove('active')
    document.querySelector('#btn-pause').innerHTML = 'Pause'
    paused = false
  } else {
    pause_screen.classList.add('active')
    document.querySelector('#btn-pause').innerHTML = 'Resume'
    paused = true
  }
})

document.querySelector('#btn-resume').addEventListener('click', () => {
  pause_screen.classList.remove('active')
  document.querySelector('#btn-pause').innerHTML = 'Pause'
  paused = false
})

document.querySelector('#btn-new-game').addEventListener('click', () => {
  returnToStartScreen()
})

const getGameInfo = () => JSON.parse(localStorage.getItem('game'))
const setPlaterName = (name) => localStorage.setItem('playerName', name)
const getPlayerName = () => localStorage.getItem('playerName')
const showTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(14, 5)

// Add space for each 9 cell block
function initGameGrid() {
  let index = 0
  for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
    let row = Math.floor(i / CONSTANT.GRID_SIZE)
    let col = i % CONSTANT.GRID_SIZE
    if (row === 2 || row === 5) cells[index].style.marginBottom = '5px'
    if (col === 2 || col === 5) cells[index].style.marginRight = '5px'
    index++
  }
}
// ---------------

function startGame() {
  start_screen.classList.remove('active')
  game_screen.classList.add('active')

  player_name.innerHTML = `${getGreetingTime()} ${name_input.value.trim()}`
  setPlaterName(name_input.value.trim())
  game_level.innerHTML = CONSTANT.LEVEL_NAME[level_index]
  seconds = 0
  timer = setInterval(() => {
    if (!paused) {
      seconds = seconds + 1
      game_timer.innerHTML = showTime(seconds)
    }
  }, 1000)
}

function getGreetingTime() {
  const hour = today.getHours()
  if (hour < 12) return 'Morning'
  if (hour < 17) return 'Afternoon'
  return 'Evening'
}

function returnToStartScreen() {
  clearInterval(timer)
  paused = false
  seconds = 0
  start_screen.classList.add('active')
  game_screen.classList.remove('active')
  pause_screen.classList.remove('active')
  document.querySelector('#btn-pause').innerHTML = 'Pause'
}

const init = () => {
  const is_dark_mode = JSON.parse(localStorage.getItem('darkMode'))
  body.classList.toggle(is_dark_mode ? 'dark' : 'light')
  document
    .querySelector('meta[name="theme-color"')
    .setAttribute('content', is_dark_mode ? '#1a1a2e' : '#fff')
  logo_image.src = is_dark_mode ? logo_dark : logo_light
  name_input.value = getPlayerName() === null ? '' : getPlayerName()
  todays_date.innerHTML = `${today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}`

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
      // tile.innerHTML = row
      document.getElementById('main-sudoku-grid').append(tile)
    }
  }
  cells = document.querySelectorAll('.main-grid-cell')
}

init()
