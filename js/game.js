'use strict'


var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gBoard
const bomb = '💣'





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
                isMarked: true
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
            if (cell.isMine === true) {
                var className = `cell bomb`
            } else {
                var className = 'cell regular'
            }
            strHTML += `<td class="${className}" onclick="onCellClicked(this)">${cell.minesAroundCount}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
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


function onCellClicked(ev) {
    ev.style.textIndent = "0px"
    if (ev.innerText === bomb) {
        openModal()
    }
}


function openModal() {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
}


function closeModal() {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
}
