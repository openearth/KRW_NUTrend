//get legendgraphic response
//create empty array
export default(legend) => {
  if (!legend.length) {
    return []
  }

  const circlesColor = [ 'match', [ 'get', 'value' ] ]
  const matchValues = [ 'rgba(255, 255, 255, 0)' ]

  legend.forEach(object => {
    matchValues.push(object.color)
    matchValues.push(object.lowerValue.toString())
  })

  return circlesColor.concat(matchValues.reverse())
}
