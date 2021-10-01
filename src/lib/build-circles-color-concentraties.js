//get legendgraphic response
//create empty array
export default(legendGraphic) => {
  if (!legendGraphic) {
    return []
  }

  const circlesColor = [ 'step', [ 'get', 'value' ] ]
  const matchValues = [ legendGraphic.legend[0].color ]
 
  legendGraphic.legend.forEach(object => {
    if (matchValues[0] !== object.color) {
      matchValues.push(object.lowerValue)
      matchValues.push(object.color)
    }
    
  })
  
  return circlesColor.concat(matchValues)
}

  