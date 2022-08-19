var pressed = document.getElementById('pressed')
var lastBody = document.getElementById('last-body')
var lastFill = document.getElementById('last-fill')
var canvasLastBody = document.getElementById('canvas-last-body')
var canvasLastBodyFill = document.getElementById('canvas-last-body-fill')
var snakeHead = document.getElementById('snake-head')
var canvasHead = document.getElementById('canvas-head')

canvasHead.addEventListener('onload', drawHead())
canvasLastBody.addEventListener('onload', onlyDrawLast())

var snakePos = document.getElementById('snake').style
var snakeConection = document.getElementById('snake-conection').style

var foodPos = document.getElementById('food').style

var snakePosGet = window.getComputedStyle(document.getElementById('snake'))
var foodPosGet = window.getComputedStyle(document.getElementById('food'))

initiate()
randomPosition()