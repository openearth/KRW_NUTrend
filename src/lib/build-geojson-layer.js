export default ({ id, data, paint }) => {
  return {
    id,
    type: 'circle',
    source: {
      type: 'geojson',
      data,
    },
    paint,
  }
}


