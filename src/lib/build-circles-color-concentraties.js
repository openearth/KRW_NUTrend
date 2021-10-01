//get legendgraphic response
//create empty array
export default(legend) => {
  if (!legend.length) {
    return []
  }

  const circlesColor = [ 'step', [ 'get', 'value' ] ]
  const matchValues = [ legend[0].color ]

  legend.forEach(object => {
    if (matchValues[0] !== object.color) {
      matchValues.push(object.lowerValue)
      matchValues.push(object.color)
    }
  })

  return circlesColor.concat(matchValues)
}
