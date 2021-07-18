const MONDAY = 1

function addDays(date, n) {
    date.setDate(date.getDate() + n)
}

function addHeader(table) {
    const weekdays = ['mn','tu','wd','th','fr','sa', 'sn']
    const row = document.createElement('tr')
    for (let day of weekdays) {
        const th = document.createElement('th')
        th.textContent = day

        row.append(th)
    }

    table.append(row)
}

function appendWeek(table, week) {
    if (week.children.length === 0) {
        return
    }

    const appendEmptyBlocksToBegin = week.firstChild.textContent === '1'
    while (week.children.length !== 7) {
        if (appendEmptyBlocksToBegin) {
            week.prepend(document.createElement('td'))
        } else {
            week.append(document.createElement('td'))
        }
    }

    table.append(week)
}

function createCalendar(calendar, year, month) {
    month -= 1 //months enumerates with zero

    const table = document.createElement('table')
    addHeader(table)

    let row = document.createElement('tr')

    let date = new Date(year, month)
    while (date.getMonth() === month) {
        if (date.getDay() === MONDAY) {
            appendWeek(table, row)
            row = document.createElement('tr')
        }

        let td = document.createElement('td')
        td.textContent = date.getDate()
        row.append(td)

        addDays(date, 1)
    }
    appendWeek(table, row)

    calendar.append(table)
}

function sendError(errorContainer, message) {
    const error = document.createElement('p')
    error.textContent = message

    errorContainer.append(error)
}

const SingleValueProxy = {
    get(target, prop) {
        if (prop === 'append') {
            return (value) => {
                while (target.firstChild) {
                    target.firstChild.remove()
                }

                target.append(value)
            }
        } else {
            return target[prop]
        }
    }
}

let resultContainer = new Proxy(
    document.querySelector('#container'),
    SingleValueProxy
)


let year = document.querySelector('#year')
let month = document.querySelector('#month')

let enterDate = document.querySelector('#enter-date')
enterDate.onclick = () => {
    const parsedMonth = Number(month.value)
    const parsedYear = Number(year.value)

    if (!Number.isInteger(parsedYear)) {
        sendError(resultContainer, 'Year should be integer number')
        return
    }

    if (!Number.isInteger(parsedMonth)) {
        sendError(resultContainer, 'Month should be integer number')
        return
    }

    if (parsedYear <= 0) {
        sendError(resultContainer, 'Year should be positive number')
        return
    }

    if (parsedMonth < 1 || parsedMonth > 12) {
        sendError(resultContainer, 'Month should be positive number between 1 and 12')
        return
    }

    createCalendar(resultContainer, parsedYear, parsedMonth)
}
