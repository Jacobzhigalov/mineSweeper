'use strict'
const bomb = '💣'
const GOOD_SMILE = '😃'
const LOSE = '🤯'
const WIN = '😎'

var gBoard
var gClick = 0
var gLives
var gSmile
var gInterval
var gTime = 1
var elMines = document.querySelector('.mines span')

var gLevel = {
    SIZE: 4,
    MINES: 2,
    LIVES: 2
}

// New Scores every refresh - you can cancel it by deliting these lines 22-27
localStorage.playerNameBeginner = 'Coding Academy😎'
localStorage.beginnerBestTime = Infinity
localStorage.playerNameMedium = 'Coding Academy😎'
localStorage.mediumBestTime = Infinity
localStorage.playerNameExpert = 'Coding Academy😎'
localStorage.expertBestTime = Infinity

document.querySelector('.beginner span').innerHTML = localStorage.playerNameBeginner
document.querySelector('.medium span').innerHTML = localStorage.playerNameMedium
document.querySelector('.expert span').innerHTML = localStorage.playerNameExpert


function onInit() {
    gTime = ''
    gClick = 0
    gLives = gLevel.LIVES
    checkLives()
    elMines.innerText = gLevel.MINES
    gSmile = document.querySelector('.smile')
    gSmile.innerText = GOOD_SMILE
    closeModal()
    timer()
    clearInterval(gInterval)
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard, '.board')
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
                isMarked: false,
                isCheckedForZero: false
            }
            board[i][j] = cell
        }
    }
    return board
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


function renderBoard(mat, selector) {

    var strHTML = '<table> <tbody>'
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            const cell = mat[i][j]
            const className = `cell cell-${i}-${j}`
            if (cell.minesAroundCount === 0) {
                strHTML += `<td class="${className}" onmousedown="clickMouse(this, event,${i}, ${j})">${''}</td>`
            } else {
                strHTML += `<td class="${className}" onmousedown="clickMouse(this, event,${i}, ${j})">${cell.minesAroundCount}</td>`
            }
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML

}


function clickMouse(ev, event, i, j) {
    if (checkVictory() === 1) return
    if (gLives === 0) return

    if (gClick === 0 && event.button === 0) {
        gInterval = setInterval(timer, 1000)
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
        cell.classList.add("shown")
        gClick++
    }
    while (gClick < 1) return

    if (event.button === 0 && gBoard[i][j].minesAroundCount === 0) {
        showNegs(gBoard, i, j)
    }

    if (event.button === 0) {
        ev.style.textIndent = "0px"
        ev.classList.add("shown")
        gBoard[i][j].isShown = true
        if (ev.innerText === bomb && gBoard[i][j].isMarked === false) {
            gBoard[i][j].isMarked = true
            gBoard[i][j].isShown = false
            gLives--
            checkLives()
            if (gLives === 0) {
                var msg = 'GAME OVER!'
                openModal(msg)
                gSmile.innerText = LOSE
                clearInterval(gInterval)
                return
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
    }

    checkVictory()

    if (checkVictory() === 1) {
        setTimeout(addBestPlayer, 500)
    }
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


function showNegs(board, rowIdx, colIdx) {
    board[rowIdx][colIdx].isCheckedForZero = true
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= gLevel.SIZE) continue
            var currCell = board[i][j]
            currCell.isShown = true
            var cell = document.querySelector(`.cell-${i}-${j}`)
            cell.style.textIndent = "0px"
            cell.classList.add("shown")
            if (currCell.minesAroundCount === 0 && currCell.isCheckedForZero === false) {
                showNegs(board, i, j)
            }
        }
    }
}


function checkVictory() {
    var checkWin = 0
    var counterShown = 0
    var counterFlags = 0
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {

            if (gBoard[i][j].isShown === true) {
                counterShown++
            }
            if (gBoard[i][j].isMarked === true) {
                counterFlags++
            }
        }
        var elMines = document.querySelector('.mines span')
        elMines.innerText = gLevel.MINES - counterFlags
    }
    if (counterShown === (gLevel.SIZE * gLevel.SIZE) - gLevel.MINES && counterFlags === gLevel.MINES) {
        var msg = 'You are the Winner!'
        openModal(msg)
        gSmile.innerText = WIN
        clearInterval(gInterval)
        checkWin = 1
        return checkWin
    }
}


function addBestPlayer() {
    gTime--
    if (checkLevel() === 0) {
        if (localStorage.beginnerBestTime > 0) {
            if (gTime < localStorage.beginnerBestTime) {
                var playerNameBeginner = prompt('Enter your Name, winner!')
                var elBoard = document.querySelector('.beginner span')
                elBoard.innerText = playerNameBeginner + ' Score: ' + gTime + 'sec'
                localStorage.playerNameBeginner = playerNameBeginner + ' Score: ' + gTime + 'sec'
                localStorage.beginnerBestTime = gTime
            } else return
        }
        else {
            var playerNameBeginner = prompt('Enter your Name, winner!')
            var elBoard = document.querySelector('.beginner span')
            elBoard.innerText = playerNameBeginner + ' Score: ' + gTime + 'sec'
            localStorage.playerNameBeginner = playerNameBeginner + ' Score: ' + gTime + 'sec'
            localStorage.beginnerBestTime = gTime
        }

    } else if (checkLevel() === 1) {
        if (localStorage.mediumBestTime > 0) {
            if (gTime < localStorage.mediumBestTime) {
                var playerNameMedium = prompt('Enter your Name, winner!')
                var elBoard = document.querySelector('.medium span')
                elBoard.innerText = playerNameMedium + ' Score: ' + gTime + 'sec'
                localStorage.playerNameMedium = playerNameMedium + ' Score: ' + gTime + 'sec'
                localStorage.mediumBestTime = gTime
            } else return
        }
        else {
            var playerNameMedium = prompt('Enter your Name, winner!')
            var elBoard = document.querySelector('.medium span')
            elBoard.innerText = playerNameMedium + ' Score: ' + gTime + 'sec'
            localStorage.playerNameMedium = playerNameMedium + ' Score: ' + gTime + 'sec'
            localStorage.mediumBestTime = gTime
        }
    }
    else {
        if (localStorage.expertBestTime > 0) {
            if (gTime < localStorage.expertBestTime) {
                var playerNameExpert = prompt('Enter your Name, winner!')
                var elBoard = document.querySelector('.expert span')
                elBoard.innerText = playerNameExpert + ' Score: ' + gTime + 'sec'
                localStorage.playerNameExpert = playerNameExpert + ' Score: ' + gTime + 'sec'
                localStorage.expertBestTime = gTime
            } else return
        }
        else {
            var playerNameExpert = prompt('Enter your Name, winner!')
            var elBoard = document.querySelector('.expert span')
            elBoard.innerText = playerNameExpert + ' Score: ' + gTime + 'sec'
            localStorage.playerNameExpert = playerNameExpert + ' Score: ' + gTime + 'sec'
            localStorage.expertBestTime = gTime
        }
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