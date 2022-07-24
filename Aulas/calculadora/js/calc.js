//NLK
var lastOperation = null
var lastNumber = null
var arrayNumbers = false
var newValue = false
var newOperation = false
var result = null
var end = false

var decimalPlace = ',' //Alterar valor inserido pelo botão

function element(){
    return document.getElementById('numDisplay').value.replace(decimalPlace , '.')
}
function elementHistory(){
    return document.getElementById('historyDisplay').value 
}

function insertValue(value){
    end = false
    newValue = true
    newOperation = false
    if(arrayNumbers === true){
        document.getElementById('numDisplay').value = value
        arrayNumbers = false
    }
    else{
        if (element() == 0){
            document.getElementById('numDisplay').value = value
        }
        else{
            document.getElementById('numDisplay').value += value
        }
    }
}

function deleteAllValues(){
    document.getElementById('numDisplay').value = 0
    arrayNumbers = false
    lastNumber = null
    numbers = null
    document.getElementById('historyDisplay').value = numbers
}

function deleteLastValue(){   

    if (newValue === true || end === true){
        var length = (document.getElementById('numDisplay').value.length) - 1;
        var newTempValue = document.getElementById('numDisplay').value.slice(0, length)
        document.getElementById('numDisplay').value = newTempValue
        lastNumber = Number(newTempValue)
    }
    if (element().length == 0){
        document.getElementById('numDisplay').value = 0
    }
}

function deleteInstanceValue(){
    document.getElementById('numDisplay').value = ''
}

function saveNumber(operation){

    if (operation == 'changeSign'){
        return document.getElementById('numDisplay').value = changeSign(element())
    }

    var sign = whichOperation(operation)


    if (result === 0 && newValue === false && elementHistory().length > 0 || (newOperation === true)){
        document.getElementById('historyDisplay').value = elementHistory().slice(0, elementHistory().length -1) + sign
    }   
    else{
        document.getElementById('historyDisplay').value += element().replace('.', decimalPlace) + sign
    }

    newOperation = true

    if (element().length != 0){
        if (lastNumber === null){
            lastNumber = Number(element())
            lastOperation = operation
            document.getElementById('numDisplay').value = ''
        }
        else{
            if (lastOperation != operation && end === false){
                equal()
                lastOperation = operation
            }
            else if(end === false){
                equal();
            }
                
            arrayNumbers = true
        }
        end = false
    }
    lastOperation = operation
    result = 0
    // if (elementHistory().length < 3){
        
    // }         
}

function plus(a, b){
    return a + b
}

function minus(a, b){
    return a - b
}

function divided(a, b){
    return a / b
}

function times(a, b){
    return a * b
}
function changeSign(a){
    return a = a < 0 ? a*-1 : -a
}

function equal(endLocal){
    
    var a = Number(element())
    result = a

    if(arrayNumbers === false && end === false){
        switch (lastOperation){
        case plus:
            result = plus(lastNumber, a)
            break
        case minus:
            result = minus(lastNumber, a)
            break
        case divided:
            result = divided(lastNumber, a)
            break
        case times:
            result = times(lastNumber, a)
            break
        }  
    } 

    if(endLocal === true){
        deleteAllValues();
        end = true;
    }  

    lastNumber = result
    document.getElementById('numDisplay').value = result.toString().replace('.', decimalPlace).slice(0, 15)
    result = 0
    newValue = false
    newOperation = false
}
function whichOperation(operation){
    
    var lastOperationSign = ''
    switch (operation){
        case plus:
            lastOperationSign = '+'
            break
        case minus:
            lastOperationSign = '-'
            break
        case divided:
            lastOperationSign = '/'
            break
        case times:
            lastOperationSign = 'x'
            break
    }            
    return lastOperationSign
}

