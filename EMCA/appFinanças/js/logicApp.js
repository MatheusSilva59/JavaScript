function add() {
    if (isValid()) {
        window.localStorage.setItem(realLengthStorage(), JSON.stringify(new Expense()))
        myModalSuccess.show()
    }
    else{
        myModalFail.show()
    }
}
function realLengthStorage() {
    let nextIndex = 0
    for (let i = 0; i < localStorage.length; i++) {
        nextIndex = nextIndex < localStorage.key(i) ? localStorage.key(i) : nextIndex
    }
    nextIndex = Number(nextIndex) + 1
    return nextIndex
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
let findForIdentity
let findForProximity
let filterForProximity = true

function initiate() {
    findForIdentity = document.getElementById('findForIdentity')
    findForProximity = document.getElementById('findForProximity')

    findForIdentity.addEventListener('click', () => {
        filterForProximity = false
        findForIdentity.className = 'dropdown-item active'
        findForProximity.className = 'dropdown-item'
    })
    findForProximity.addEventListener('click', () => {
        filterForProximity = true
        findForProximity.className = 'dropdown-item active'
        findForIdentity.className = 'dropdown-item'
    })

    filterClass = new Expense()
    jsonToObject()
    showAllExpense()
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
}
function jsonToObject() {
    for (let item = 0; item < localStorage.length; item++) {
        window['class' + item] = JSON.parse(localStorage[localStorage.key(item)])
    }
}
function showAllExpense() {
    var tbody = document.querySelector('#tbody-main')
    //clear all nodes
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild)
    }

    for (let item = 0; item < localStorage.length; item++) {
        let tr = document.createElement('tr')
        for (index in window['class' + item]) {
            let td = document.createElement('td')
            if (window['class' + item][index].length > 20) {
                console.log('grande')
                td.textContent = window['class' + item][index].toString().slice(0, 10)
                let btn = document.createElement('button')
                let i = document.createElement('i')

                //btn popover
                btn.className = 'd-flex btn-popover'
                btn.id = 'btn' + localStorage.key(item)
                i.className = 'fa-solid fa-ellipsis align-self-end icon-popover'
                btn.appendChild(i)

                btn.addEventListener('click', () => { console.log('ampliar') })
                btn.type = 'button'

                btn.setAttribute('data-bs-container', 'body')
                btn.setAttribute('data-bs-toggle', 'popover')
                btn.setAttribute('data-bs-placement', 'bottom')
                btn.setAttribute('tabindex', '0')
                btn.setAttribute('role', 'button')
                btn.setAttribute('data-bs-trigger', 'focus')
                btn.setAttribute('data-bs-content', window['class' + item][index])
                //btn popover
                td.appendChild(btn)
            }
            else {
                if (index === 'category') {
                    td.textContent = translateCategory(window['class' + item][index])
                }
                else {
                    td.textContent = window['class' + item][index]
                }
            }
            tr.appendChild(td)
        }
        // button
        let td = document.createElement('td')
        let btn = document.createElement('button')
        let i = document.createElement('i')
        td.className = 'text-center'
        btn.className = 'btn btn-danger'
        i.className = 'fa-solid fa-xmark'
        btn.appendChild(i)
        btn.addEventListener('click', () => {
            let tempTr = document.getElementById(`tr${localStorage.key(item)}`)
            tbody.removeChild(tempTr)
            window.localStorage.removeItem(localStorage.key(item))
        })
        td.appendChild(btn)
        tr.appendChild(td)
        // button end
        tr.id = 'tr' + localStorage.key(item)
        tbody.appendChild(tr)
    }
}
function translateCategory(value) {
    switch (value) {
        case 'education':
            return 'Educação'
        case 'food':
            return 'Alimentação'
        case 'transport':
            return 'Transporte'
        case 'leisure':
            return 'Lazer'
        case 'health':
            return 'Saúde'
    }
}
function updateValue() {
    filterClass.date = document.getElementById('date').value
    filterClass.category = document.getElementById('category').value
    filterClass.description = document.getElementById('description').value
    filterClass.cashValue = document.getElementById('cash-value').value
}
function filter() {
    updateValue()
    for (let item = 0; item < localStorage.length; item++) {
        let tempTr = document.getElementById(`tr${localStorage.key(item)}`)
        for (index in window['class' + item]) {
            if (index != 'description' || !filterForProximity) {
                //identity filter
                if (filterClass[index] === window['class' + item][index] || filterClass[index] === '' || filterClass[index] === 'Tipo') {
                    tempTr.style.display = 'table-row'
                }
                else {
                    tempTr.style.display = 'none'
                    break
                }
            }
            else {
                let flterTempTrim = filterClass[index].toString().trim()
                if (flterTempTrim != '') {
                    let tempRegExp = new RegExp(`([${window['class' + item][index]}]{${filterClass[index].length}})`, 'i')
                    if (filterClass[index].match(tempRegExp)) {
                        tempTr.style.display = 'table-row'
                    }
                    else {
                        tempTr.style.display = 'none'
                        break
                    }
                }
            }
        }
    }
}

