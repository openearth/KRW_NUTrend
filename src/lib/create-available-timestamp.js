const { VUE_APP_MIN_YEAR } = process.env
const { VUE_APP_MAX_YEAR } = process.env

/** 
  Creates timeSpan
 */
export default () => {
    const minYear = parseInt(VUE_APP_MIN_YEAR)
    const maxYear = parseInt(VUE_APP_MAX_YEAR)

    const span = maxYear-minYear + 1
    let timeSpan = [ minYear ]
    Array.from(Array(span), (_, i) => timeSpan.push(minYear + i)) 
    return timeSpan
}
