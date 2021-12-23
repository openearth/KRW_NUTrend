export default ({ id, data, paint }, uniqueId) => {
 
  return {
    id: `${ id }-${ uniqueId }`,
    type: 'circle',
    source: {
      type: 'geojson',
      data,
    },
    paint,
  }
}
