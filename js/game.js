'use strict'

var gBoard
const bomb = '💣'

var gLevel = {
    SIZE: 5,
    MINES: 4
}

var gGame = {
    isOn:false,
    shownCount:0,
    markedCount:0,
    secsPassed:0
}


function onInit() {
    closeModal()
    gBoard = buildBoard(gLevel.SIZE)
    console.table(gBoard)
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
                isMarked: false
            }
            board[i][j] = cell
        }
    }
    var countBombs = 0
    while (countBombs !== gLevel.MINES) {
        var x = getRandomInt(0, size - 1)
        var z = getRandomInt(0, size - 1)
        if (board[x][z].isMine === false) {
            board[x][z].isMine = true
            board[x][z].minesAroundCount = bomb
            countBombs++
        }
    }
    i = 0
    j = 0
    for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++) {
            if (board[i][j].isMine === true) continue
            board[i][j].minesAroundCount = setMinesNegsCount(board, i, j)
            // if (board[i][j].minesAroundCount === 0) board[i][j].minesAroundCount = ''
        }
    }

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
    console.log(event.button)
    console.log(ev)
    if (event.button === 0) {
        ev.style.textIndent = "0px"
        if (ev.innerText === bomb) {
            openModal()
        }
    } else {
        if (event.button === 2 && ev.style.textIndent !== "0px") {
            ev.style.textIndent = "0px"
            ev.innerText = '🚩'
            // console.log(event)
        } else if (ev.innerText === '🚩') {
            ev.style.textIndent = "-9999px"
            console.log('hello')
            ev.innerText = gBoard[i][j].minesAroundCount
        }
    }
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


// function onCellClicked(ev) {
//     if (ev.innerText === '🚩') {
//         ev.innerText === '🚩'
//     }
//     else {
//         ev.style.textIndent = "0px"
//         if (ev.innerText === bomb) {
//             openModal()
//         }
//     }
// }



function openModal() {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
}


function closeModal() {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
}
