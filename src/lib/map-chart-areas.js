/**
 * Map the area values recieved from a request to the chart areas we need.
 *
 * Output example:
 * [
 *   { name: 'Goed', color: 'rgb(181, 239, 181)', min: '0', max: '2.5' }
 *   ...
 * ]
 */
export default (areas, maxValue) => {
 
  if (!areas.length) {
    return []
  }

  const areaSettings = [
    { name: 'Goed', color: 'rgb(181, 239, 181)' },
    { name: 'Matig', color: 'rgb(240, 240, 133)' },
    { name: 'Ontoereikend', color: 'rgb(255, 210, 128)' },
    { name: 'Slecht', color: 'rgb(233, 158, 160)' },
  ]

  const sortedAreas = areas.sort((a, b) => a.value - b.value)

  return areaSettings
    .map(({ name, color }, index) => {
    
      let max
      let min = sortedAreas[index - 1]?.value || '0'
      if (index === 3) {
       
        max = maxValue
      }else {
        max = sortedAreas[index]?.value || (parseFloat(sortedAreas[index - 1]?.value, 10) ).toString()
      }
     
      return { name, color, min, max }
    })
}
