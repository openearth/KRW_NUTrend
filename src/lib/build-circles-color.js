//get legendgraphic response
//create empty array
export default(legend, semicircle) => {
  if (!legend.length) {
    return []
  }
  let circlesColor
  //If semicircle has value (then it means that we need to read the old value/value2)
  if (semicircle) {
    circlesColor = [ 'match', [ 'get', 'value2' ] ]
  }else{
    circlesColor = [ 'match', [ 'get', 'value' ] ]
  }
  const matchValues = [ 'rgba(255, 255, 255, 0)' ]

  legend.forEach(object => {
    matchValues.push(object.color)
    matchValues.push(object.lowerValue.toString())
  })

  return circlesColor.concat(matchValues.reverse())
}
