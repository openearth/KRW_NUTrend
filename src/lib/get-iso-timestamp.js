/**
 * To get correct timestamp we convert the year to a new Date timestamp,
 * add the timezone offset, then convert back to a date object,
 * and then get the ISO string.
 */
export default (year) => {
  const yearNumber = year ? year : new Date().getFullYear()
  const date = new Date(yearNumber, 0, 1)
  const isoString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
  return isoString.replace(/\.[0-9]{3}/, '')
}
