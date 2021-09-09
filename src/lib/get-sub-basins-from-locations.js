/**
 * Filter locations by sub-basin name.
 *
 * Steps:
 * 1. Filter by sub-basin name.
 * 2. Use .map() to return any matched values.
 * 3. Sort results alphabetically.
 * 4. Return unique values using Set().
 */
export default (locations) => {
  if (!locations.length) {
    return []
  }

  const filterBySubBasin = ({ name, value }) => name === 'Deelstroomgebied' && value.startsWith('Rijn')

  const filteredLocations = locations
    .filter(({ attributes }) => attributes.find(filterBySubBasin))
    .map(({ attributes }) => {
      const match = attributes.find(filterBySubBasin)
      return match?.value || null
    })
    .sort((a, b) => a.localeCompare(b))

  return [ ...new Set(filteredLocations) ]
}
