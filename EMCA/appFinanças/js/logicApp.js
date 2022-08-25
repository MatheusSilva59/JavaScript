
function add() {
    if (isValid()) {
        window.localStorage.setItem(localStorage.length, JSON.stringify(new Expense()))
        myModal.show()
    }
    else {
        //console.log(localStorage)

    }
}

class Expense {
    constructor() {
        this.date = document.getElementById('date').value
        this.category = document.getElementById('category').value
        this.description = document.getElementById('description').value
        this.cashValue = document.getElementById('cash-value').value
    }
}
function simpleValidation() {
    for (let item of arguments) {
        if (item != null && item != '' && item != 'Tipo') {
            return true
        }
    }
    return false
}
function numberValidation(item) {
    let num = /\d/
    let letter = /\D/
    if (item.match(num) === null || item.match(letter) !== null) {
        return false
    }
    if (simpleValidation(item)) {
        return true
    }
    return false
}
function isValid() {
    let date = document.getElementById('date').value
    let category = document.getElementById('category').value
    let description = document.getElementById('description').value
    let cashValue = document.getElementById('cash-value').value
    if (simpleValidation(date, category, description) && numberValidation(cashValue)) {
        return true
    }
}
let filterClass
function addClassToFilter(){
    filterClass = new Expense()
    jsonToObject()
}
function jsonToObject(){
    for (let item = 0; item < localStorage.length; item++){
        window['class' + item] = JSON.parse(localStorage[localStorage.key(item)])
    }
}
function showAllExpense() {
    var tbody = document.querySelector('#tbody-main')
    //clear all nodes
    while (tbody.firstChild){
        tbody.removeChild(tbody.firstChild)
    }

    for (let item = 0; item < localStorage.length; item++) {
        let tr = document.createElement('tr')
        for (index in window ['class' + item]) {
            let td = document.createElement('td')
            td.textContent = window['class' + item][index]
            tr.appendChild(td)
        }
        // button
        let td = document.createElement('td')
        let btn = document.createElement('btn')
        let i = document.createElement('i')
        td.className = 'text-center'  
        btn.className = 'btn btn-danger'
        i.className = 'fa-solid fa-xmark'
        btn.appendChild(i)
        btn.addEventListener('click', () => {
            let tempTr = document.getElementById(`tr${localStorage.key(item)}`)
            tbody.removeChild(tempTr)
            //window.localStorage.removeItem(localStorage.key(item))
            reOrderStorage()
        })
        td.appendChild(btn)
        tr.appendChild(td)
        // button end
        tr.id = 'tr' + localStorage.key(item)
        tbody.appendChild(tr)
    }
}
function updateValue(){
    filterClass.date = document.getElementById('date').value
    filterClass.category = document.getElementById('category').value
    filterClass.description = document.getElementById('description').value
    filterClass.cashValue = document.getElementById('cash-value').value
}
function filter(){
    updateValue()
    for (let item = 0; item < localStorage.length; item++){
        let tempTr = document.getElementById(`tr${localStorage.key(item)}`)
        for (index in window ['class' + item]) {
            if (index != 'description'){
                if (filterClass[index] === window['class' + item][index] || filterClass[index] === '' || filterClass[index] === 'Tipo'){
                    tempTr.style.display = 'table-row'
                }
                else{
                    tempTr.style.display = 'none'
                    break
                }
            }
        }
    }
}
function reOrderStorage(){
    for (let item = 0; item < localStorage.length; item++){
        localStorage.setItem(item, JSON.stringify(window ['class' + localStorage.key(item)]))
        console.log(window ['class' + localStorage.key(item)])
        console.log(localStorage.key(item))
        console.log(item)
    }
}

