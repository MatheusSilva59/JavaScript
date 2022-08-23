
function add() {
    if (isValid()) {
        window.localStorage.setItem(window.localStorage.length, JSON.stringify(new Expense()))
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
function showAllExpense() {
    //let tbody = document.querySelector('tbody-main')
    //let tempTr = document.createElement('tr')
    let tbody = document.querySelector('#tbody-main')
    for (let item = 0; item < localStorage.length; item++) {
        let temp = JSON.parse(localStorage[item])
        let tr = document.createElement('tr')
        for (index in temp) {
            let td = document.createElement('td')
            td.textContent = temp[index]
            tr.appendChild(td)
        }
        //btn
        let td = document.createElement('td')
        let btn = document.createElement('btn')
        let i = document.createElement('i')
        td.className = 'text-center'
        btn.className = 'btn btn-danger'
        i.className = 'fa-solid fa-xmark'
        btn.appendChild(i)
        td.appendChild(btn)
        tr.appendChild(td)
        //btn fim
        tbody.appendChild(tr)
    }
}