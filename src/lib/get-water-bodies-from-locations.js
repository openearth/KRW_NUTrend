/**
 * Filter locations by body of water name.
 *
 * Steps:
 * 1. Filter by body of water name.
 * 2. If a basin is selected, also filter by basin name.
 * 3. If sub-basin is selected, also filter by sub-basin name.
 * 4. If a manager is selected, also filter by manager name.
 * 5. Use .map() to return any matched values.
 * 6. Sort results alphabetically.
 * 7. Return unique values using Set().
 */
export default (locations, selectedBasin, selectedSubBasin, selectedWaterManager) => {
  if (!locations.length) {
    return []
  }

  const filterByBodyOfWater = ({ name }) => name === 'OWMIDENT' || name ==='VERWIJZING'

  const filteredLocations = locations
    .filter(({ attributes }) => attributes.find(filterByBodyOfWater))
    .filter(({ attributes }) => selectedBasin
      ? attributes.find(({ name, value }) => name === 'Stroomgebied' && value === selectedBasin)
      : true,
    )
    .filter(({ attributes }) => selectedSubBasin
      ? attributes.find(({ name, value }) => name === 'Deelstroomgebied' && value === selectedSubBasin)
      : true,
    )
    .filter(({ attributes }) => selectedWaterManager
      ? attributes.find(({ name, value }) => name === 'Waterbeheerder' && value === selectedWaterManager)
      : true,
    )
    .map(({ attributes }) => {
      const match = attributes.find(filterByBodyOfWater)
      return match?.value || null
    })
    .sort((a, b) => a.localeCompare(b))

  return [ ...new Set(filteredLocations) ]
}
