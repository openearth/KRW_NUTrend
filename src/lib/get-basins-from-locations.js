/**
 * Filter locations by basin name.
 *
 * Steps:
 * 1. Filter by basin name.
 * 2. Use .map() to return any matched values.
 * 3. Sort results alphabetically.
 * 4. Return unique values using Set().
 */
export default (locations) => {
  if (!locations.length) {
    return []
  }

  const filterByBasin = ({ name }) => name === 'Stroomgebied'

  const filteredLocations = locations
    .filter(({ attributes }) => attributes.find(filterByBasin))
    .map(({ attributes }) => {
      const match = attributes.find(filterByBasin)
      return match?.value || null
    })
    .sort((a, b) => a.localeCompare(b))

  return [ ...new Set(filteredLocations) ]
}
