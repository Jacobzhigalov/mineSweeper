'use strict'
const bomb = '💣'
const GOOD_SMILE = '😃'
const LOSE = '🤯'
const WIN = '😎'

var gBoard
var gClick = 0
var gLives = 3
var gSmile

var gLevel = {
    SIZE: 5,
    MINES: 5
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function onInit() {
    gLives = 3
    gClick = 0
    closeModal()
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard, '.board')
    var lives = document.querySelector('.lives span')
    lives.innerText = gLives
    gSmile = document.querySelector('.smile')
    gSmile.innerText = GOOD_SMILE
}

function createBombs(i, j) {
    var countBombs = 0
    while (countBombs !== gLevel.MINES) {
        var x = getRandomInt(0, gLevel.SIZE - 1)
        var z = getRandomInt(0, gLevel.SIZE - 1)
        if (x === i && z === j) continue
        if (gBoard[x][z].isMine === false) {
            gBoard[x][z].isMine = true
            gBoard[x][z].minesAroundCount = bomb
            countBombs++
        }
    }
}

function buildBoard(size) {
    const sizeBoard = size
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            const cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
        }
    }
    // var countBombs = 0
    // while (countBombs !== gLevel.MINES) {
    //     var x = getRandomInt(0, size - 1)
    //     var z = getRandomInt(0, size - 1)
    //     if (board[x][z].isMine === false) {
    //         board[x][z].isMine = true
    //         board[x][z].minesAroundCount = bomb
    //         countBombs++
    //     }
    // }
    // i = 0
    // j = 0
    // for (i = 0; i < size; i++) {
    //     for (j = 0; j < size; j++) {
    //         if (board[i][j].isMine === true) continue
    //         board[i][j].minesAroundCount = setMinesNegsCount(board, i, j)
    //         // if (board[i][j].minesAroundCount === 0) board[i][j].minesAroundCount = ''
    //     }
    // }

    return board
}


function renderBoard(mat, selector) {

    var strHTML = '<table> <tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = `cell cell-${i}-${j}`
            // if (cell.isMine === true) {
            //     var className = `cell bomb`
            // } else {
            //     var className = 'cell regular'
            // }
            strHTML += `<td class="${className}" onmousedown="mouseButton(this, event,${i}, ${j})">${cell.minesAroundCount}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML

}

function mouseButton(ev, event, i, j) {

    if (gClick === 0 && event.button === 0) {
        createBombs(i, j)
        for (var x = 0; x < gLevel.SIZE; x++) {
            for (var z = 0; z < gLevel.SIZE; z++) {
                gBoard[x][z].isMarked = false
                if (gBoard[x][z].isMine === true) continue
                gBoard[x][z].minesAroundCount = setMinesNegsCount(gBoard, x, z)
            }
        }
        renderBoard(gBoard, '.board')
        var cell = document.querySelector(`.cell-${i}-${j}`)
        cell.style.textIndent = "0px"
        gClick++
    }

    

    if (event.button === 0) {
        ev.style.textIndent = "0px"
        //console.log(ev)
        gBoard[i][j].isShown = true
        if (ev.innerText === bomb) {
            gBoard[i][j].isMarked = true
            gBoard[i][j].isShown = false
            gLives--
            var lives = document.querySelector('.lives span')
            lives.innerText = gLives
            if (lives.innerText === '0') {
                var msg = 'GAME OVER!'
                openModal(msg)
                gSmile.innerText = LOSE
            }
        }
    } else {
        if (event.button === 2 && ev.style.textIndent !== "0px") {
            ev.style.textIndent = "0px"
            ev.innerText = '🚩'
            gBoard[i][j].isMarked = true
            // console.log(event)
        } else if (ev.innerText === '🚩') {
            ev.style.textIndent = "-9999px"
            ev.innerText = gBoard[i][j].minesAroundCount
            gBoard[i][j].isMarked = false
        }
        // else if (ev.innerText === '💣') {
        //     ev.style.textIndent = "-9999px"
        // }
    }
    checkVictory()
}

function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}


function setMinesNegsCount(board, rowIdx, colIdx) {
    var minesCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= gLevel.SIZE) continue
            var currCell = board[i][j]
            if (currCell.isMine) minesCount++
        }
    }
    return minesCount
}


function checkVictory() {
    var counterShown = 0
    var counterFlags = 0
    for (var i = 0; i < gLevel.SIZE; i++) {
        //console.log(i)
        for (var j = 0; j < gLevel.SIZE; j++) {
            //console.log(j)
            //console.log(gBoard[i][j].isShown)
            if (gBoard[i][j].isShown === true) {
                counterShown++
            }
            if (gBoard[i][j].isMarked === true) {
                counterFlags++
            }
        }

    }
    console.log('Shown', counterShown)
    console.log('Flags', counterFlags)

    if (counterShown === (gLevel.SIZE * gLevel.SIZE) - gLevel.MINES && counterFlags === gLevel.MINES) {
        var msg = 'You are the Winner!'
        openModal(msg)
        gSmile.innerText = WIN
        console.table(gBoard)
    }
}


function openModal(msg) {
    const elModal = document.querySelector('.modal')
    const elSpan = elModal.querySelector('.msg')
    elSpan.innerText = msg
    elModal.style.display = 'block'
}


function closeModal() {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
}
