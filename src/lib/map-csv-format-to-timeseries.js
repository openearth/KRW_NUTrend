/**
 * Create json for csv download.
 *
 * Steps:
 * 1. Map timeseries into a new array with objects that have the following format
 * {
 *  Stroomgebied:
 *  Waterbeheerder:
 *  Waterlichaam:
 *  WaterlichaamId:
 *  Jaar
 *  --- CASE toestand ---
 *  Klasse:
 *  Toestand:
 *  Stof:
 * --- CASE concentratie ---
 *  Concentratie:
 *  Unit:
 *  Kental: 
 *  * }
 * 
 */

export default(data, locationsWithRelations, particle, type) => {

  if (!data || !locationsWithRelations.length) {
    return []
  }
  const { timeSeries } = data
 
  const stof = particle === 'ntot' ? 'N Totaal'
                :particle === 'ptot' ? 'P Totaal'
                :particle === 'din' ? 'DIN' : null

  let rows = []
  timeSeries.forEach(location => {
    const { header, events } = location
    
    const { locationId } = header
    const filterByLocationId = ({ WaterlichaamId }) => WaterlichaamId === locationId
    const relationsObject = locationsWithRelations.find(filterByLocationId)
    if (type === 'state') {
      const locationRows = events.map(event => {

      return {
      ...relationsObject,
      Klasse: event?.value,
      Toestand: event.value === '0' ? 'Goed'
                :event.value === '1' ? 'Matig'
                :event.value === '2' ? 'Ontoereikend'
                :event.value === '3' ? 'Slecht'
                : null,
      Stof: stof,
      Jaar: event?.date.slice(0,4),
     }  
    })
    rows = [ ...rows, ...locationRows ]
    }else {
    const locationRows = events.map(event => {

      return {
      ...relationsObject,
      Concentratie: event?.value,
      Unit: 'Mg/L',
      Toestand:  event.value === '0' ? 'Goed'
                :event.value === '1' ? 'Matig'
                :event.value === '2' ? 'Ontoereikend'
                :event.value === '3' ? 'Slecht'
                : null,
      Stof: stof,
      Kental: '3-jarig zomerhalfjaargemiddelde',
      Jaar: event?.date.slice(0,4),
     }  
    })
    rows = [ ...rows, ...locationRows ]
    }
   })
  return rows
}