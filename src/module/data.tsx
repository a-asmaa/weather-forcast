import moment from "moment"

let _months = moment.months();

export const months = _months.map((x, i) => { return { key: i, value: x } })



export const years = () => {
    const years = []
    const dateStart = moment('2009')
    const dateEnd = moment('2022')
    let i = 1;
    while (dateEnd.diff(dateStart, 'years') >= 0) {
        years.push({ key: i, value: dateStart.format('YYYY') })
        dateStart.add(1, 'year')
        i++
    }
    return years
}


export const getDaysByMonth = (month: string) => {
    const daysInMonth = moment(month, "MMMM").daysInMonth();
    let arr = Array.from({ length: daysInMonth }, (v, k) => k + 1)

    return arr.map((x, i) => { return { key: i, value: x } })
};
