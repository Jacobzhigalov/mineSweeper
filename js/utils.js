'use strict'



function beginner() {
    gLevel.SIZE = 4
    gLevel.MINES = 2
    gLevel.LIVES = 2
    onInit()
}


function medium() {
    gLevel.SIZE = 8
    gLevel.MINES = 14
    gLevel.LIVES = 3
    onInit()
}


function expert() {
    gLevel.SIZE = 12
    gLevel.MINES = 32
    gLevel.LIVES = 4
    onInit()
}


function checkLevel() {
    if (gLevel.SIZE === 4) return 0
    else if (gLevel.SIZE === 8) return 1
    else return 2
}


function timer() {
    var time = document.querySelector('.time span')
    time.innerText = gTime
    gTime++
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min)
}
