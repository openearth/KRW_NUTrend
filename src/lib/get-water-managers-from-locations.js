/**
 * Filter locations by manager name.
 *
 * Steps:
 * 1. filter by manager name
 * 2. If a basin is selected, also filter by basin name.
 * 3. If sub-basin is selected, also filter by sub-basin name.
 * 4. Use .map() to return any matched values.
 * 5. Sort results alphabetically.
 * 6. Return unique values using Set().
 */
export default (locations, selectedBasin, selectedSubBasin) => {
  if (!locations.length) {
    return []
  }

  const filterByManager = ({ name }) => name === 'Waterbeheerder'

  const filteredLocations = locations
    .filter(({ attributes }) => attributes.find(filterByManager))
    .filter(({ attributes }) => selectedBasin
      ? attributes.find(({ name, value }) => name === 'Stroomgebied' && value === selectedBasin)
      : true,
    )
    .filter(({ attributes }) => selectedSubBasin
      ? attributes.find(({ name, value }) => name === 'Deelstroomgebied' && value === selectedSubBasin)
      : true,
    )
    .map(({ attributes }) => {
      const match = attributes.find(filterByManager)
      return match?.value || null
    })
    .sort((a, b) => a.localeCompare(b))

  return [ ...new Set(filteredLocations) ]
}
