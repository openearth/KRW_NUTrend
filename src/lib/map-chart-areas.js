/**
 * Map the area values recieved from a request to the chart areas we need.
 *
 * Output example:
 * [
 *   { name: 'Goed', color: 'rgb(181, 239, 181)', min: '0', max: '2.5' }
 *   ...
 * ]
 */
export default (areas) => {
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
      const min = sortedAreas[index - 1]?.value || '0'
      const max = sortedAreas[index]?.value || (parseFloat(sortedAreas[index - 1]?.value, 10) + 1).toString()

      return { name, color, min, max }
    })
}
