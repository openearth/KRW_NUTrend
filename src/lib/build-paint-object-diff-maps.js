export default (circleStrokeColors) => {
  console.log('paint diff', circleStrokeColors)
  const circleColors = circleStrokeColors.map(rule => rule[1] == 'value' ?  [ 'get', 'value2' ] : rule  )
  return {
    'circle-radius': 3,
    'circle-stroke-opacity': 1,
    'circle-stroke-color': circleStrokeColors,
    'circle-stroke-width': 3,
    'circle-opacity': 1,
    'circle-color': circleColors,
  }
}
