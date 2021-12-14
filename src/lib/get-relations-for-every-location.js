/**
 * Get relations for every location .
 *
 * Steps:
 * 1. Map locations into a new array with objects
 * {
 *  Stroomgebied:
 *  Waterbeheerder:
 *  Waterlichaam:
 *  WaterlichaamId
 * }
 * 
 */
export default (locations) => {
  if (!locations.length) {
    return []
  }
  const filterByBasin = ({ name }) => name === 'Stroomgebied'
  const filterBySubBasin = ({ name, value }) => name === 'Deelstroomgebied' && value.startsWith('Rijn')
  const filterByManager = ({ name }) => name === 'Waterbeheerder'

  const locationsWithRelations = locations.map((location) => {
    const { attributes, locationId, shortName } = location

    const Basin = attributes.find(filterByBasin)?.value||null
    const SubBasin = attributes.find(filterBySubBasin)?.value||null
    const WaterManager =  attributes.find(filterByManager)?.value||null
    

    
    return {
      Stroomgebied: Basin,
      Deelstroomgebied: SubBasin, 
      Waterbeheerder: WaterManager,
      Waterlichaam: shortName, 
      WaterlichaamId: locationId,
    }
  })
  return locationsWithRelations

}
