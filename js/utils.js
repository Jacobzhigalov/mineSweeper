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

function checkLives() {
    if (gLives === 4) {
        var lives = document.querySelector('.lives span')
        lives.innerText = '❤️❤️❤️❤️'
    }
    if (gLives === 3) {
        var lives = document.querySelector('.lives span')
        lives.innerText = '❤️❤️❤️'
    }
    if (gLives === 2) {
        var lives = document.querySelector('.lives span')
        lives.innerText = '❤️❤️'
    }
    if (gLives === 1) {
        var lives = document.querySelector('.lives span')
        lives.innerText = '❤️'
    }
    if (gLives === 0) {
        var lives = document.querySelector('.lives span')
        lives.innerText = '💀'
    }
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
