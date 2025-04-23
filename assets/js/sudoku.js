import { CONSTANT } from './constant.js'
import { BOARD_TEMPLATES } from '../data/BOARD_TEMPLATES.js'
import { NINE_SUDOKU_GRIDS } from '../data/NINE_SUDOKU_GRID.js'
import { CONSTANT_KEYBOARDS } from '../data/KEYBOARDS.js'

export function sudokuGen(mode, grid, gameType, level) {
  let game = {}
  let edition
  switch (grid) {
    case '4X4':
      game = sudoku4x4Gen(mode, 4, gameType, level)
      break
    case '6X6':
      game = sudoku6x6Gen(mode, 6, gameType, level)
      break
    case '8X8':
      game = sudoku8x8Gen(mode, 8, gameType, level)
      break
    case '9X9':
      game = sudoku9x9Gen(mode, 9, gameType, level)
      return {
        solution: game.solution,
        board: game.board,
        keys: game.keys,
        edition: game.edition,
      }

    default:
      break
  }
}

export function sudokuCheck(grid) {
  let unassigned_pos = {
    row: -1,
    col: -1,
  }

  if (!findUnassignedPos(grid, unassigned_pos)) return true

  grid.forEach((row, i) => {
    row.forEach((num, j) => {
      if (isSafe(grid, i, j, num)) {
        if (isFullGrid(grid)) {
          return true
        } else {
          if (sudokuCreate(grid)) {
            return true
          }
        }
      }
    })
  })

  return isFullGrid(grid)
}

function sudoku9x9Gen(mode, grid, gameType, level) {
  console.log('sudoku9x9Gen')
  let totalSolutions = 0
  let totalBoardTemplates = 0
  let totalKeys = CONSTANT_KEYBOARDS.KEYBOARD_9X9_DIGITS.length
  let getSolution = []
  let getBoard = []
  let getKeys = []
  let getBoardTemplate = []

  switch (gameType) {
    case 'Regular':
      totalSolutions = NINE_SUDOKU_GRIDS.NINE_REGULAR.length
      break
    case 'Hyper':
      totalSolutions = NINE_SUDOKU_GRIDS.NINE_HYPER.length
      break
    case 'Center':
      totalSolutions = NINE_SUDOKU_GRIDS.NINE_CENTER.length
      break
    case 'Outside':
      totalSolutions = NINE_SUDOKU_GRIDS.NINE_OUTSIDE.length
      break
    case 'Inside':
      totalSolutions = NINE_SUDOKU_GRIDS.NINE_INSIDE.length
      break
    case 'Arrow':
      totalSolutions = NINE_SUDOKU_GRIDS.NINE_ARROW.length
      break
    case 'Sudoku X':
      totalSolutions = NINE_SUDOKU_GRIDS.NINE_SUDOKU_X.length
      break
    default:
      break
  }
  switch (level) {
    case 'Easy':
      totalBoardTemplates = BOARD_TEMPLATES.BOARD_9X9_EASY.length
      break
    case 'Normal':
      totalBoardTemplates = BOARD_TEMPLATES.BOARD_9X9_NORMAL.length
      break
    case 'Hard':
      totalBoardTemplates = BOARD_TEMPLATES.BOARD_9X9_HARD.length
      break
    default:
      break
  }
  const seedSloution = rand(totalSolutions)
  const seedBoardTemplate = rand(totalBoardTemplates)
  const seedKeys = rand(totalKeys)
  const getEdition = `9X9-${seedSloution}${seedBoardTemplate}${seedKeys}`
  console.log(getEdition)
  getKeys = CONSTANT_KEYBOARDS.KEYBOARD_9X9_DIGITS[seedKeys]
  getSolution = NINE_SUDOKU_GRIDS.NINE_REGULAR[seedSloution]
  getSolution = rearangeByKeys(getSolution, getKeys)
  getKeys = createKeyBoard(mode, getKeys)
  getSolution = converBoardToMode(getSolution, mode, getKeys)
  getBoardTemplate = setBoardTemplate(
    BOARD_TEMPLATES.BOARD_9X9_EASY[seedBoardTemplate],
    getSolution
  )

  getBoardTemplate = setBoardTemplate(
    BOARD_TEMPLATES.BOARD_9X9_EASY[rand(totalBoardTemplates)],
    getSolution
  )
  getSolution = breakDown(getSolution, grid)
  getBoard = breakDown(getBoardTemplate, grid)
  return {
    solution: getSolution,
    board: getBoard,
    keys: getKeys,
    edition: getEdition,
  }
}
function sudoku8x8Gen(mode, grid, gameType, level) {
  console.log('sudoku8x8Gen')
}
function sudoku6x6Gen(mode, grid, gameType, level) {
  console.log('sudoku6x6Gen')
}
function sudoku4x4Gen(mode, grid, gameType, level) {
  console.log('sudoku4x4Gen')
}

function rand(max) {
  let edition = Math.floor(Math.random() * max)
  return edition
}

function breakDown(board, gridSize) {
  //   console.log(board)
  const newBoard = []
  let temprow = []
  for (let i = 0; i < board.length + 1; i++) {
    if ((i + 1) % gridSize === 0) {
      if (i !== 0) {
        temprow.push(board[i])
        newBoard.push(temprow)
        temprow = []
      } else {
        temprow.push(board[i])
      }
    } else {
      temprow.push(board[i])
    }
  }
  return newBoard
}

function setBoardTemplate(boardTemplate, solutionArray) {
  console.log('setBoardTemplate')
  //   console.log(boardTemplate)
  //   console.log(solutionArray)
  const totalChars = boardTemplate.length
  let newBoard = ''

  // Iterate over all characters in chunks of size equal to the target array length
  for (let i = 0; i < totalChars; i++) {
    const oldBoard = boardTemplate.slice(i, i + 1) // Extract the current chunk
    const oldSolution = solutionArray.slice(i, i + 1) // Extract the current chunk

    if (oldBoard === '-') {
      newBoard += oldBoard
    } else {
      newBoard += oldSolution
    }
  }
  //   console.log('setBoardTemplate-end', newBoard)
  return newBoard
}

function rearangeByKeys(board, keys) {
  console.log('rearangeByKeys')

  let newBoard = ''
  let isEqual = false
  for (let i = 0; i < board.length; i++) {
    const oldBoard = board[i] // Extract the current chunk
    for (let j = 0; j < keys.length; j++) {
      const oldKey = keys.slice(j, j + 1) // Extract the current chunk
      if (Number(oldBoard) === j + 1) {
        newBoard += oldKey
        isEqual = true
      } else {
        isEqual = false
      }

      //   console.log(Number(oldBoard), j, isEqual)
    }
  }

  return newBoard
}

function createKeyBoard(mode, keys) {
  console.log('createKeyBoard')

  let orderedKeys = sortNumberString(keys)
  switch (mode) {
    case 'Numbers':
      return orderedKeys.toString()
    case 'Letters':
      return (orderedKeys = 'ABCDEFGHI')
    case 'Shapes':
      return (orderedKeys = '0jklmnopq')
    case 'Roman Numbers':
      return (orderedKeys = 'abcdefghi')
    case 'Dots':
      return (orderedKeys = 'rstuvwxyz')
    case 'Colors':
      return undefined
    default:
      return undefined
  }
}

function sortNumberString(scrambledNumber) {
  // 1. Convert the number to a string
  const numStr = String(scrambledNumber)

  // 2. Split the string into an array of individual digits
  const digitsArray = numStr.split('')

  // 3. Sort the array of digits numerically
  digitsArray.sort((a, b) => parseInt(a) - parseInt(b))

  // 4. Join the sorted digits back into a string
  const sortedNumberString = digitsArray.join('')

  // 5. Optionally, convert the sorted string back to a number
  const sortedNumber = Number(sortedNumberString)

  return sortedNumber
}

function converBoardToMode(board, mode, keys) {
  if (mode === 'Numbers') return board
  let newBoard = ''
  for (let i = 0; i < board.length; i++) {
    const oldBoard = board[i] // Extract the current chunk
    for (let j = 0; j < keys.length; j++) {
      const oldKey = keys.slice(j, j + 1) // Extract the current chunk
      if (Number(oldBoard) === j + 1) {
        newBoard += oldKey
      }
    }
  }
  return newBoard
}
