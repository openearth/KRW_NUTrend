//get legendgraphic response
//create empty array
export default(legendGraphic) => {
  if (!legendGraphic.length) {
    return []
  }

  const circlesColor = [ 'step', [ 'get', 'value' ] ]
  const matchValues = [ legendGraphic[0].color ]

  legendGraphic.forEach(object => {
    if (matchValues[0] !== object.color) {
      matchValues.push(object.lowerValue)
      matchValues.push(object.color)
    }
  })

  return circlesColor.concat(matchValues)
}
