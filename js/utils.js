'use strict'


function createMat(ROWS, COLS) {
    const mat = []
    for (var i = 0; i < ROWS; i++) {
        const row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function drawNum() {
    
    var random = Math.floor(Math.random() * (gNums.length))
    var num = gNums[random]
    gNums.splice(random, 1)
    return num
}

function resetNums(gNums) {
    //console.log(gNums)
    for (var i = 1; i < 101; i++) {
        gNums.push(i)
    }
    //console.log(gNums)
    return gNums
}


function renderCell(location, value) {
	const cellSelector = '.' + getClassName(location)// '.cell-2-7'
	const elCell = document.querySelector(cellSelector)
	elCell.innerHTML = value
}

function getClassName(position) { // {i:2 , j:5}
	const cellClass = `cell-${position.i}-${position.j}` // 'cell-2-5'
	return cellClass
}

function getEmptyPos() {
    const emptyPoss = []
    for (var i = 0; i < gBoard.length; i++) {
      for (var j = 0; j < gBoard[0].length; j++) {
        if (gBoard[i][j].type !== WALL && !gBoard[i][j].gameElement) {
          emptyPoss.push({ i, j }) // {i:1,j:3}
        }
      }
    }
    var randIdx = getRandomInt(0, emptyPoss.length)
    return emptyPoss[randIdx]
  }
  