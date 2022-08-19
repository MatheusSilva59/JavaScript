var stepToCSS = 'px'
var stepToCalc = 50
var step = 5

var leftPos = 0
var topPos = 0
var timeDelay = 150

var isMoving
var lastInput

var actualDirection = null

var ms = timeDelay / 10
var temp = null
var timeInputs
var timeBetweenInputs = 0
var firstKey = false
var counter = 0
var numberKeysDown = 0

var lastPosTop = 0
var lastPosLeft = 0

var score = 0

var isExecutingW = false
var isExecutingS = false
var isExecutingA = false
var isExecutingD = false
var isExecutingContinuos = false

var byStep = false

var arrayKeys = new Array()
var arrayBody = new Array()

var arrayColors = ['#92D40E', '#971297']

var snakeColor = '#92D40E'
var mapColor = '#060606'

var moveKeys = /[wsad]/i

document.onkeydown = function (value) { actions(value) }

function actions(value) {
    isReset = false
    if (value.key.match(moveKeys) && value.key.length === 1) {
        isPause = false
        moveSnake(value.key)
        counter = 0
        if (numberKeysDown % 2 === 0) { //Contador
            if (timeInputs === undefined) {
                timeInputs = setInterval(
                    function () {
                        counter++
                        //document.getElementById('h1-nav').innerHTML = counter
                    }, 1
                )
            }
        }
    }
    else if (value.key === 'p') {
        pause(value)
    }
    else if (value.key === 'm') {
        singleInput()
    }
    else if (value.key === 'r' && isMoving != undefined) {
        if (isDead) {
            restartGame()
        }
        else {
            shouldReset = true
        }
    }
}
var isPause = false
var shouldPause = false

function pause(value) {
    if (isMoving != undefined) {
        shouldPause = true
    }
}

function singleInput() {
    byStep = byStep === false ? true : false
}

var shouldReset = false
var isReset = false
var maxScore = 0
function restartGame() {

    isReset = true
    randomPosition()
    let fill = document.getElementsByClassName('fill')
    let fillet = document.getElementsByClassName('fillet')

    for (let i = 0; i < bodyArray.length; i++) {
        bodySet[0].remove()
    }
    for (let p = 0; p < fillPosition.length; p++) {
        fill[0].remove()
    }
    for (let x = 0; x < filletPosition.length; x++) {
        fillet[0].remove()
    }
    fillPosition = []
    filletPosition = []
    arrayKeys = []
    arrayLastKeys = []
    bodyArray = []

    window.cancelAnimationFrame(isMoving)
    isCollidingBody = false
    isMoving = undefined

    posString = ''
    operationString = ''
    isLeft = false
    isValid = false

    isDead = false

    document.getElementById('nav-actual').innerHTML = 0

    maxScore = maxScore < score - 2 ? score - 2 : maxScore

    document.getElementById('nav-max').innerHTML = maxScore

    notExecuting()

    clearAllInterval()
    initiate()
}

var posString = ''
var operationString = ''
var isLeft = false
var isValid = false

function notExecuting() {
    isExecutingW = false
    isExecutingS = false
    isExecutingA = false
    isExecutingD = false
}
function isExecuting() {
    if (isExecutingW === true || isExecutingS === true || isExecutingA === true || isExecutingD === true || isExecutingContinuos === true) {
        return true
    }
    else {
        return false
    }
}


var lastPosBodyLeft
var lastPosBodyTop
var arrayLastPositions = new Array()
var lengthBody = 10
var isEating = false

var lastPosTopSnake
var lastPosLeftSnake
var endCycle = 0
var eatLastStep = false
var statusDirection = { x: 'none', y: 'none', lastX: 'none', lastY: 'none' }

function canMove(firstTarget, secondTarget, operation) {

    arrayLastPositions.push({ left: leftPos, top: topPos })

    lengthBody = score === 0 ? lengthBody : 10 * (score + 1)

    let indexLocal = lengthBody - 11 < 0 ? 0 : lengthBody - 11


    if (arrayLastPositions.length === lengthBody || isEating === true) { //Continuos

        if (indexLocal != 0 && arrayLastPositions.length === lengthBody) { arrayLastPositions.shift(); isEating = false }
        lastPosLeft = arrayLastPositions[indexLocal].left
        lastPosTop = arrayLastPositions[indexLocal].top
        if (indexLocal === 0 && arrayLastPositions.length === lengthBody) { arrayLastPositions.shift() }
    }

    if (bodySet.length === 0) {
        lastPosBodyLeft = lastPosLeft
        lastPosBodyTop = lastPosTop
    }

    if (operation == '+') {
        if (firstTarget == 'leftPos') {
            leftPos += step
        }
        else {
            topPos += step
        }
    }
    else {
        if (firstTarget == 'leftPos') {
            leftPos -= step
        }
        else {
            topPos -= step
        }
    }

    lastPosLeftSnake = lastPosLeftSnake === undefined ? leftPos : lastPosLeftSnake
    lastPosTopSnake = lastPosTopSnake === undefined ? topPos : lastPosTopSnake

    if (topPos + stepToCSS === foodPosGet.top && leftPos + stepToCSS === foodPosGet.left) {
        willEat = true
    }
    else {
        willEat = false
    }

    colissionBody()

    if (leaveMap()) {
        clearAllInterval()
        window.cancelAnimationFrame(isMoving)
    }
    else if (isCollidingBody === false && isReset === false) {

        if (hasBody) {
            filletBodyApply()
        }
        else {
            lastPosLeftSnake = leftPos
            lastPosTopSnake = topPos
        }

        snakePos = document.getElementById('snake').style

        if (secondTarget === true) {
            snakePos.left = leftPos + stepToCSS
        }
        else {
            snakePos.top = topPos + stepToCSS
        }

        if (isHeadAnimation) {
            drawHead(lastAnimationHead.angle, lastAnimationHead.type)
        }

        if (leftPos % 50 === 0 && topPos % 50 === 0) {
            animationBodyByfood = false
            lastBodyDirection()
            //Adiciona posição à lista de banimento de posicionamento para a comida, pois está em uso
            indexThereSomething.push(coordToIndex(Math.round(leftPos / 50) * 50, Math.round(topPos / 50) * 50))
        }
    }
}

var isDead = false

function defaultMove() {

    if (leftPos % 50 === 0 && topPos % 50 === 0) {
        if (shouldReset) {
            restartGame()
            shouldReset = false
        }
        if (shouldPause) {
            isPause = true
            window.cancelAnimationFrame(isMoving)
            isMoving = undefined
            shouldPause = false
        }
    }
    if (isReset === false && isPause === false) {
        if (leftPos % 50 === 0 && topPos % 50 === 0 && byStep === false) {
            if (arrayKeys.length != 0) {
                whichDirection(arrayKeys[0])
                arrayKeys.shift()
            }

            if (arrayLastKeys.length != 0) {
                whichDirection(arrayLastKeys[0])
                arrayLastKeys.shift()
            }
        }
        notExecuting()
        canMove(posString, isLeft, operationString)
        if (leaveMap() === false && isCollidingBody === false) {

            bodySnakeApply()

            collisionFood()

            snakeConectionFunc(actualDirection)

            if (hasBody === false && indexThereSomething.length > 1) {
                //console.log('INDEX RETIRADO SE NÃO HAVER CORPO: ' + indexThereSomething[0])
                indexThereSomething.shift()
                //console.log(indexThereSomething)
            }
            if (byStep === false) {
                isMoving = window.requestAnimationFrame(defaultMove)
            }
            else if (repeat < stepToCalc - 5) {
                window.requestAnimationFrame(defaultMove)
                repeat += step
            }
        }
        else {
            isDead = true
        }
    }
}

var repeat = 0
var arrayLastKeys = new Array()

function moveSnake(directionLocal) {

    if (leftPos % 50 === 0 && topPos % 50 === 0) {
        if (arrayLastKeys.length === 0) {
            whichDirection(directionLocal)
        }
    }
    else {
        arrayLastKeys.push(directionLocal)
    }
    if (byStep === true) {
        repeat = 0
        if (isOtherThan != directionLocal) {
            defaultMove()
        }
    }
    else {
        if (isMoving === undefined) {
            if (isValid === true) {
                isMoving = window.requestAnimationFrame(defaultMove)
            }
        }
    }
}

function whichDirection(direction) {
    // console.log('DIRECTION: ' + direction)
    // console.log('arrayKEYS: ' + arrayKeys)
    if (arrayKeys.length > 1) {
        arrayKeys.pop()
    }
    switch (direction) {
        case 'w':
            if (actualDirection != 's' && isExecuting() === false) {
                isExecutingW = true
                posString = 'topPos'
                operationString = '-'
                isLeft = false
                actualDirection = 'w'
                //console.log('W')
                isValid = true
                isOtherThan = 's'
            }
            else {
                isValid = false
                //console.log('W')
                arrayKeys.push(direction)
            }
            break

        case 's':
            if (actualDirection != 'w' && isExecuting() === false) {
                isExecutingS = true
                posString = 'topPos'
                operationString = '+'
                isLeft = false
                actualDirection = 's'
                //console.log('S')
                isValid = true
                isOtherThan = 'w'
            }
            else {
                isValid = false
                //console.log('S')
                arrayKeys.push(direction)
            }
            break

        case 'a':
            if (actualDirection != 'd' && isExecuting() === false) {
                isExecutingA = true
                posString = 'leftPos'
                operationString = '-'
                isLeft = true
                actualDirection = 'a'
                //console.log('A')
                isValid = true
                isOtherThan = 'd'
            }
            else {
                isValid = false
                //console.log('A')
                arrayKeys.push(direction)
            }
            break

        case 'd':
            if (actualDirection != 'a' && isExecuting() === false) {
                isExecutingD = true
                posString = 'leftPos'
                operationString = '+'
                isLeft = true
                actualDirection = 'd'
                //console.log('D')
                isValid = true
                isOtherThan = 'a'
            }
            else {
                isValid = false
                //console.log('D')
                arrayKeys.push(direction)
            }
            break
    }
}
function clearAllInterval() {
    clearInterval(temp)
    clearInterval(timeInputs)
}
function leaveMap() {
    if (leftPos < 0 || leftPos > 1400 - stepToCalc || topPos < 0 || topPos > 600 - stepToCalc) {
        return true
    }
    else {
        return false
    }
}

var isCollidingBody = false

function colissionBody() {

    if (hasBody === true) {

        bodySnakeComputed()

        if (bodySet.length > 2) {
            for (let i = 0; i < bodySet.length; i++) {


                if (i != bodySet.length - 1) {
                    if (positiveNumber(bodyArray[i].left - roundByDirection(leftPos)) < 50 &&
                        positiveNumber(bodyArray[i].top - roundByDirection(topPos)) < 50) {
                        isCollidingBody = true
                        break
                    }
                }
                else {
                    if (positiveNumber(bodyArray[i - 1].left - roundByDirection(leftPos)) < 50 &&
                        positiveNumber(bodyArray[i - 1].top - roundByDirection(topPos)) < 50) {
                        isCollidingBody = true
                        break
                    }
                }
            }
        }
    }
}

var animationBodyByfood = false
var willEat = false
function collisionFood() { //Melhorar sistema de colisão com a comida, há falhas não frequentes

    

    if (roundByDirection(topPos) + stepToCSS === foodPosGet.top && roundByDirection(leftPos) + stepToCSS === foodPosGet.left) {
        animationBodyByfood = true
    }

    if (willEat) {

        indexThereSomething.push(coordToIndex(Math.round(lastPosBodyLeft / 50) * 50, Math.round(lastPosBodyTop / 50) * 50))

        randomPosition()

        hasBody = true

        let map = document.querySelector('.map')
        let bodyTemp = document.createElement('span')
        let bodyTempStyle = document.createElement('span')

        bodyTemp.className = 'snake-body d-flex justify-content-center align-items-center'
        bodyTemp.style.left = lastPosBodyLeft + stepToCSS
        bodyTemp.style.top = lastPosBodyTop + stepToCSS
        bodyTempStyle.className = 'snake-body-style'
        bodyTemp.appendChild(bodyTempStyle)
        map.appendChild(bodyTemp)
    

        isEating = true
        score++
        document.getElementById('nav-actual').innerHTML = score - 2

        lastBody.style.left = lastPosBodyLeft + stepToCSS
        lastBody.style.top = lastPosBodyTop + stepToCSS
        lastFill.style.left = lastPosBodyLeft + stepToCSS
        lastFill.style.top = lastPosBodyTop + stepToCSS
        bodySetStyle[score - 1].style.display = 'none'
        bodySetStyle[score - 2].style.display = 'block'

        if (bodyArray[score - 2].left > lastPosBodyLeft) {
            drawLast(0, 'noDelay')
        }
        else if (bodyArray[score - 2].left < lastPosBodyLeft) {
            drawLast(180, 'noDelay')
        }
        else if (bodyArray[score - 2].top > lastPosBodyTop) {
            drawLast(90, 'noDelay')
        }
        else if (bodyArray[score - 2].top < lastPosBodyTop) {
            drawLast(270, 'noDelay')
        }

        //drawAll()
        //drawHead(lastAnimationHead.angle, lastAnimationHead.type)

    }

}

var mapWidth
var mapHeight
var allPos = []
var allIndex = []

var isOtherThan

function initiate() {

    mapWidth = 1400 - stepToCalc
    mapHeight = 600 - stepToCalc

    let i = 0

    allIndex = new Array()
    allPos = new Array()

    for (let x = 0; x <= mapWidth; x += stepToCalc) {
        for (let y = 0; y <= mapHeight; y += stepToCalc) {
            allPos.push({ left: x, top: y })
            allIndex.push(i)
            i++
        }
    }
    //console.log(allPos)
    //temporário spawn
    leftPos = 200
    topPos = 200
    snakePos.left = '200px'
    snakePos.top = '200px'
    arrayLastPositions = []
    for (let x = 0; x < 29; x++) {
        arrayLastPositions[x] = { left: 55 + x * 5, top: 200 }
    }
    score = 2
    hasBody = true
    statusDirection.x = 'right'
    statusDirection.y = 'bottom'
    statusDirection.lastX = 0
    statusDirection.lastY = 200
    lastPosLeftSnake = 200
    lastPosTopSnake = 200

    let map = document.querySelector('.map')
    let body1 = document.createElement('span')
    let body1style = document.createElement('span')
    let body2 = document.createElement('span')
    let body2style = document.createElement('span')

    body1style.className = 'snake-body-style'
    body1style.style.width = '60px'
    body1style.style.height = '40px'
    body1style.style.backgroundColor = snakeColor
    body1.append(body1style)
    body1.className = 'snake-body d-flex justify-content-center align-items-center'
    body1.style.left = '150px'
    body1.style.top = '200px'

    body2style.className = 'snake-body-style'
    body2style.style.width = '60px'
    body2style.style.height = '40px'
    body2style.style.backgroundColor = snakeColor
    body2.append(body2style)
    body2.className = 'snake-body d-flex justify-content-center align-items-center'
    body2.style.left = '100px'
    body2.style.top = '200px'

    map.appendChild(body1)
    map.appendChild(body2)

    lastBody.style.left = '100px'
    lastBody.style.top = '200px'
    lastFill.style.left = '100px'
    lastFill.style.top = '200px'
    
    indexThereSomething = new Array()
    indexThereSomething.push(28, 40, 52)

    actualDirection = 'd'
    lastKey = undefined
    isOtherThan = 'a'

    bodySetStyle[score - 1].style.display = 'none'

    onlyDrawHead()
    onlyDrawLast()

    snakeHead.style.transform = 'rotate(' + 0 + 'deg)'

    lastAngleHead = 0
    angleHead = 0
    snakeConectionFunc('d')

    lastFill.style.transform = 'rotate(0deg)'
}

function checkThereSomething(value) {

    let there = false

    for (let i = 0; i < indexThereSomething.length; i++) {
        if (indexThereSomething[i] === value) {
            there = true
            break
        }
    }
    if (there === false) { return value }
}

function randomNumber() {
    let tempAllIndex = allIndex.filter(checkThereSomething)
    let value = tempAllIndex[Math.floor(Math.random() * tempAllIndex.length)]
    return value
}

var indexThereSomething = new Array()

function randomPosition() {
    let index = randomNumber()
    foodPos.left = allPos[index].left + stepToCSS
    foodPos.top = allPos[index].top + stepToCSS
}

function coordToIndex(left, top) {

    let x1 = left / 50 * 12
    let y1 = top / 50
    let temp

    if (y1 == 0) {
        temp = x1
    }
    else {
        temp = Number(x1 + y1)
    }

    return temp
}

var bodyArray = new Array()
const bodySet = document.getElementsByClassName('snake-body')
const bodySetStyle = document.getElementsByClassName('snake-body-style')

var hasBody = false
var indexToCalculateFillet = 0
var auxIndexLast = 0
var auxIndexOthers = 0

function bodySnakeComputed() {

    for (let i = 0; i < bodySet.length; i++) {
        if (i != bodySet.length - 1) {
            if (isEating) {
                bodyArray[i] = arrayLastPositions[lengthBody - (10 * i) - 20 + auxIndexOthers]
            }
            else {
                bodyArray[i] = arrayLastPositions[lengthBody - (10 * i) - 11]
            }
        }
        else {
            if (isEating) {
                auxIndexOthers++
                bodyArray[i] = arrayLastPositions[auxIndexLast]
                if (auxIndexLast === 9) {
                    isEating = false
                    auxIndexLast = 0
                    auxIndexOthers = 0
                }
                else {
                    auxIndexLast++
                }
            }
            else {
                bodyArray[i] = arrayLastPositions[9]
            }

            lastPosBodyLeft = arrayLastPositions[0].left
            lastPosBodyTop = arrayLastPositions[0].top


            try {
                if (leftPos % 50 === 0 && topPos % 50 === 0) {

                    if (bodyArray[i].left === allPos[indexThereSomething[1]].left &&
                        bodyArray[i].top === allPos[indexThereSomething[1]].top) {

                        indexThereSomething.shift()

                    }
                }
            } catch (e) { continue }
        }


        if (i === 1) {
            indexToCalculateFillet = lengthBody - (10 * i) - 11
        }
    }
}

function clearUn(value) {
    return Number(value.replace('px', ''))
}

function roundValue(value) {
    return Math.round(value / 25) * 25
}

function positiveNumber(value) {
    if (value < 0) {
        return value * -1
    }
    else {
        return value
    }
}

function roundByDirection(value) {

    let a

    switch (actualDirection) {
        case 'w':
            a = Math.floor(value / 50) * 50
            break
        case 's':
            a = Math.ceil(value / 50) * 50
            break
        case 'a':
            a = Math.floor(value / 50) * 50
            break
        case 'd':
            a = Math.ceil(value / 50) * 50
            break
    }
    return a
}

function absoluteValue(a, b) {
    a = positiveNumber(a)
    b = positiveNumber(b)
    return positiveNumber(a - b)
}

var statusDirection = { x: 'none', y: 'none', lastX: 'none', lastY: 'none' }
function filletBodyApply() {
    if (lastPosLeftSnake != leftPos && endCycle === 0) {
        endCycle++
        if (statusDirection.lastY != topPos) {
            if (lastPosLeftSnake > leftPos) {
                //console.log('INDO PARA ESQUERDA')
                if (statusDirection.y === 'top') {
                    drawHead(-180, '-')
                    drawFillet(lastPosTopSnake, lastPosLeftSnake, 0, 5, -5, bodyArray.length)
                    statusDirection.lastY = topPos
                }
                else if (statusDirection.y === 'bottom') {
                    drawHead(180, '+')
                    drawFillet(lastPosTopSnake, lastPosLeftSnake, 90, 5, 5, bodyArray.length)
                    statusDirection.lastY = topPos
                }
                statusDirection.x = 'left'
            }
            else if (lastPosLeftSnake < leftPos) {
                //console.log("INDO PARA DIREITA")
                if (statusDirection.y === 'top') {
                    drawHead(0, '+')
                    drawFillet(lastPosTopSnake, lastPosLeftSnake, 270, -5, -5, bodyArray.length)
                    statusDirection.lastY = topPos
                }
                else if (statusDirection.y === 'bottom') {
                    drawHead(0, '-')
                    drawFillet(lastPosTopSnake, lastPosLeftSnake, 180, -5, 5, bodyArray.length)
                    statusDirection.lastY = topPos
                }
                statusDirection.x = 'right'
            }
        }

        lastPosLeftSnake = leftPos
    }
    else if (lastPosTopSnake != topPos && endCycle === 0 && bodySet.length > 0) {
        endCycle++
        //console.log('TOP DIFERENTE')

        if (statusDirection.lastX != leftPos) {
            if (lastPosTopSnake > topPos) {
                //console.log('INDO PARA CIMA')
                if (statusDirection.x === 'left') {
                    drawHead(270, '+')
                    drawFillet(lastPosTopSnake, lastPosLeftSnake, 180, -5, 5, bodyArray.length)
                    statusDirection.lastX = leftPos
                }
                else if (statusDirection.x === 'right') {
                    drawHead(-90, '-')
                    drawFillet(lastPosTopSnake, lastPosLeftSnake, 90, 5, 5, bodyArray.length)
                    statusDirection.lastX = leftPos
                }
                statusDirection.y = 'top'
            }
            else if (lastPosTopSnake < topPos) {
                //console.log('INDO PARA BAIXO')
                if (statusDirection.x === 'left') {
                    drawHead(-270, '-')
                    drawFillet(lastPosTopSnake, lastPosLeftSnake, 270, -5, -5, bodyArray.length)
                    statusDirection.lastX = leftPos
                }
                else if (statusDirection.x === 'right') {
                    drawHead(90, '+')
                    drawFillet(lastPosTopSnake, lastPosLeftSnake, 0, 5, -5, bodyArray.length)
                    statusDirection.lastX = leftPos
                }
                statusDirection.y = 'bottom'
            }
        }
        lastPosTopSnake = topPos
    }

    if (endCycle != 0) {
        if (leftPos % 50 === 0 && topPos % 50 === 0) {
            endCycle = 0
            lastPosLeftSnake = leftPos
            lastPosTopSnake = topPos
        }
    }
}

var noDelayRemoveFill = false

function bodySnakeApply() {

    let xy

    if (isCollidingBody === false) {

        for (let i = 0; i < bodySet.length; i++) {

            xy = window.getComputedStyle(document.getElementsByClassName('snake-body')[i])

            bodySetStyle[i].style.backgroundColor = snakeColor

            if (bodyArray[i].left != clearUn(xy.left) && bodyArray[i].top == clearUn(xy.top)) {
                bodySetStyle[i].style.width = '60px'
                bodySetStyle[i].style.height = '40px'
                bodySet[i].style.left = bodyArray[i].left + stepToCSS
            }

            if (bodyArray[i].top != clearUn(xy.top) && bodyArray[i].left == clearUn(xy.left)) {
                bodySetStyle[i].style.width = '40px'
                bodySetStyle[i].style.height = '60px'
                bodySet[i].style.top = bodyArray[i].top + stepToCSS
            }

            if (i === bodySet.length - 1) {

                if (true) {
                    lastBody.style.left = bodyArray[i].left + stepToCSS
                    lastBody.style.top = bodyArray[i].top + stepToCSS
                    lastFill.style.left = bodyArray[i].left + stepToCSS
                    lastFill.style.top = bodyArray[i].top + stepToCSS
                }

                bodySetStyle[i].style.display = 'none'


                if (fillPosition.length != 0 && roundValue(bodyArray[i].top) === fillPosition[0].top && roundValue(bodyArray[i].left) === fillPosition[0].left && willEat === false) {

                    let fill = document.getElementsByClassName('fill')[0]
                    if (leaveMap() === false && isCollidingBody === false && animationBodyByfood === false) {
                        //console.log(fill)
                        fill.remove()
                        fillPosition.shift()
                    }
                }

                if (filletPosition.length != 0 && bodyArray[i].top === filletPosition[0].top && bodyArray[i].left === filletPosition[0].left) {

                    setTimeout(
                        function () {
                            let fillet = document.getElementsByClassName('fillet')[0]
                            if (leaveMap() === false && isCollidingBody === false && animationBodyByfood === false) {
                                fillet.remove()
                                filletPosition.shift()
                            }
                        }, 0
                    )

                }
            }
            else {
                bodySetStyle[i].style.display = 'block'
            }
        }
    }
}

var filletPosition = []
var fillPosition = []

function drawFillet(posTop, posLeft, rotate, transX, transY, time) {

    //document.getElementById('map').innerHTML += '<canvas class="fillet" width=50px height=50px></canvas>'
    //document.getElementById('map').innerHTML += '<canvas class="fill" width=50px height=50px></canvas>'

    let map = document.querySelector('.map')
    let fillet = document.createElement('canvas')
    let fill = document.createElement('canvas')
    fill.className = 'fill'
    fillet.className = 'fillet'
    map.appendChild(fill)
    map.appendChild(fillet)

    drawAll()

    let filletLocal = document.getElementsByClassName('fillet')[document.getElementsByClassName('fillet').length - 1]
    let fillLocal = document.getElementsByClassName('fill')[document.getElementsByClassName('fill').length - 1]


    filletPosition.push({ left: posLeft, top: posTop })
    fillPosition.push({ left: posLeft, top: posTop })

    filletLocal.style.left = (posLeft + transX) + stepToCSS
    filletLocal.style.top = (posTop + transY) + stepToCSS
    filletLocal.style.transform = 'rotate(' + rotate + 'deg)'

    fillLocal.style.left = (posLeft + transX) + stepToCSS
    fillLocal.style.top = (posTop + transY) + stepToCSS
    fillLocal.style.transform = 'rotate(' + rotate + 'deg)'

    
}

var img = new Image()
img.src = 'images/fundo-canvas.png'

function drawAll() {
    onlyDrawLast()
    for (let x = 0; x < document.getElementsByClassName('fillet').length; x++) {

        let fillet = document.getElementsByClassName('fillet')[x]
        let ctx = fillet.getContext('2d')

        ctx.canvas.height = 50
        ctx.canvas.width = 50

        if (fillet.getContext) {
            ctx.fillStyle = mapColor
            ctx.beginPath();
            ctx.lineTo(50, 0)
            ctx.lineTo(50, 50)
            ctx.lineTo(40, 50)
            ctx.arc(0, 50, 40, 0 * (Math.PI / 180), 270 * (Math.PI / 180), true)
            ctx.lineTo(0, 0)
            ctx.fill()
            ctx.drawImage(img, -5, 0)
        }
    }

    for (let y = 0; y < document.getElementsByClassName('fill').length; y++) {
        let fill = document.getElementsByClassName('fill')[y]
        let ctxFill = fill.getContext('2d')

        ctxFill.canvas.height = 50
        ctxFill.canvas.width = 50

        if (fill.getContext) {
            ctxFill.fillStyle = snakeColor
            ctxFill.fillRect(0, 0, 50, 50)
        }
    }
}
var angleHead = 0
var lastAngleHead = 0
var lastType
var transXSnake = 0
var transYSnake = 0
var limitTranslate = 0
var isOrigin = false

var isHeadAnimation = false
var lastAnimationHead = { angle: 0, type: 'none' }
function drawHead(angle, type) {

    lastAnimationHead.angle = angle
    lastAnimationHead.type = type
    snakeHead = document.getElementById('snake-head')

    if (lastType != type && lastType != undefined && lastAngleHead != 0) {

        if (type === '-') {
            angleHead -= 360
            lastAngleHead -= 360
        }
        else {
            angleHead += 360
            lastAngleHead += 360
        }
    }

    lastType = lastType === type ? lastType : type
    type = type === '-' ? -1 : 1

    if (angle === 0 && positiveNumber(angleHead) >= 270) {
        angle = 360 * type
        isOrigin = true
    }

    if (angle != angleHead) {
        isHeadAnimation = true
    }
    else {
        isHeadAnimation = false
        lastAngleHead = angle
        if (isOrigin) {
            angleHead = 0
            lastAngleHead = 0
            isOrigin = false
        }
    }

    if (angle != undefined && isHeadAnimation == true) {
        angleHead += ((absoluteValue(lastAngleHead, angle)) * type) / 10
    }

    snakeHead.style.transform = 'rotate(' + angleHead + 'deg)'

    onlyDrawHead()
}

function onlyDrawHead() {
    canvasHead = document.getElementById('canvas-head')
    let ctxHead = canvasHead.getContext('2d')

    if (canvasHead.getContext) {
        ctxHead.clearRect(0, 0, 60, 60)
        ctxHead.save()
        ctxHead.translate(5, 5)
        ctxHead.fillStyle = snakeColor //'rgb(38, 8, 189)'
        ctxHead.beginPath()
        ctxHead.arc(-4.26, -79.87, 85, deg(90 - 2.87), deg(84.4262), true)
        ctxHead.arc(2.06, -15.18, 20, deg(90 - 5.5738), deg(61.8275), true)
        ctxHead.arc(17.17, 13.03, 12, deg(180 + 61.8275), deg(180 + 113.7578))
        ctxHead.arc(-18.29, 93.58, 100, deg(180 + 113.7578), deg(180 + 130.3635))
        ctxHead.arc(40, 25, 10, deg(180 + 130.3635), deg(0))
        ctxHead.arc(40, 25, 10, deg(0), deg(49.6365))
        ctxHead.arc(-18.29, -43.58, 100, deg(180 - 130.3635), deg(180 - 113.7578))
        ctxHead.arc(17.17, 36.97, 12, deg(180 - 113.7578), deg(180 - 61.8275))
        ctxHead.arc(2.06, 65.18, 20, deg(270 + 28.1725), deg(270 + 5.5738), true)
        ctxHead.arc(-4.26, 129.87, 85, deg(270 + 5.5738), deg(270 + 2.87), true)
        ctxHead.lineTo(0, 5.02)
        ctxHead.fill()

        ctxHead.fillStyle = '#5A7D59'
        ctxHead.beginPath()
        ctxHead.arc(30.5, 15, 4, deg(90), deg(300))
        ctxHead.lineTo(38.5, 15)
        ctxHead.arc(37.5, 16.73, 2, deg(300), deg(87.7958))
        ctxHead.lineTo(30.5, 19)
        ctxHead.fill()

        ctxHead.beginPath()
        ctxHead.fillStyle = '#395138'
        ctxHead.arc(35, 16.11, 2.71, deg(0), deg(360))
        ctxHead.fill()


        ctxHead.beginPath()
        ctxHead.fillStyle = '#395138'
        ctxHead.arc(47, 23, .5, deg(0), deg(360))
        ctxHead.fill()

        ctxHead.fillStyle = '#5A7D59'
        ctxHead.beginPath()
        ctxHead.arc(30.5, 35, 4, deg(60), deg(270))
        ctxHead.lineTo(37.58, 31.27)
        ctxHead.arc(37.5, 33.27, 2, deg(267.7958), deg(60))
        ctxHead.lineTo(32.5, 38.46)
        ctxHead.fill()

        ctxHead.fillStyle = '#395138'
        ctxHead.beginPath()
        ctxHead.arc(35, 33.89, 2.71, deg(0), deg(360))
        ctxHead.fill()

        ctxHead.beginPath()
        ctxHead.fillStyle = '#395138'
        ctxHead.arc(47, 27, .5, deg(0), deg(360))
        ctxHead.fill()
        ctxHead.restore()
        ctxHead.restore()
    }
}
var lastKey

function snakeConectionFunc(actualDirection) {

    snakeConection.backgroundColor = snakeColor
    if (lastKey != actualDirection) {
        switch (actualDirection) {
            case 'w':
                snakeConection.transform = 'rotate(0deg)'
                snakeConection.top = '50px'
                snakeConection.left = '5px'
                if (hasBody && actualDirection === 'w') { snakeConection.display = 'block' }
                break
            case 's':
                snakeConection.transform = 'rotate(0deg)'
                snakeConection.top = '-10px'
                snakeConection.left = '5px'
                if (hasBody && actualDirection === 's') { snakeConection.display = 'block' }
                break
            case 'a':
                snakeConection.transform = 'rotate(90deg)'
                snakeConection.top = '20px'
                snakeConection.left = '35px'
                if (hasBody && actualDirection === 'a') { snakeConection.display = 'block' }
                break
            case 'd':
                snakeConection.transform = 'rotate(90deg)'
                snakeConection.top = '20px'
                snakeConection.left = '-25px'
                if (hasBody && actualDirection === 'd') { snakeConection.display = 'block' }
                break
        }
        lastKey = actualDirection
    }
}
function lastBodyDirection() {
    let lastIndex = bodySet.length - 1
    let penultimateIndex = bodySet.length - 2
    if (bodyArray[lastIndex].left > bodyArray[penultimateIndex].left) {
        drawLast(180)
    }
    else if (bodyArray[lastIndex].left < bodyArray[penultimateIndex].left) {
        drawLast(0)
    }
    else if (bodyArray[lastIndex].top > bodyArray[penultimateIndex].top) {
        drawLast(270)
    }
    else if (bodyArray[lastIndex].top < bodyArray[penultimateIndex].top) {
        drawLast(90)
    }
}

var lastAnimationBody = { angle: 0 }

function drawLast(angle, delay) {

    lastBody = document.getElementById('last-body')
    lastFill = document.getElementById('last-fill')

    lastAnimationBody.angle = angle

    if (delay === undefined && animationBodyByfood === false) {
        lastFill.style.transform = 'rotate(' + (angle) + 'deg)'
    }
    else {
        lastFill.style.transform = 'rotate(' + (angle) + 'deg)'
    }
    onlyDrawLast()

}
function onlyDrawLast() {
    canvasLastBody = document.getElementById('canvas-last-body')
    canvasLastBodyFill = document.getElementById('canvas-last-body-fill')

    let ctx = canvasLastBody.getContext('2d')
    let ctxFill = canvasLastBodyFill.getContext('2d')

    if (canvasLastBody.getContext) {
        ctx.clearRect(0, 0, 60, 60)
        ctx.save()
        ctx.translate(5, 5)


        ctx.fillStyle = snakeColor
        ctx.beginPath()
        ctx.arc(25, 25, 20, deg(0), deg(360))
        ctx.fill()
        ctx.restore()
    }
    if (canvasLastBodyFill.getContext) {
        ctxFill.clearRect(0, 0, 60, 60)
        ctxFill.save()
        ctxFill.translate(5, 5)
        ctxFill.fillStyle = snakeColor
        ctxFill.fillRect(25, 5, 50, 40)
        ctxFill.restore()
    }
}
function deg(value) {
    return value * (Math.PI / 180)
}
