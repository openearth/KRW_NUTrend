export default ({ id, data }, uniqueId) => {
  return {
    id: `${ id }-outer-circle-${ uniqueId }`,
    type: 'circle',
    source: {
      type: 'geojson',
      data,
    },
    paint: {
    'circle-radius': 6,
    'circle-stroke-opacity': 1,
    'circle-stroke-color': '#808080',
    'circle-stroke-width': 1,
    'circle-color': 'rgba(255, 255, 255, 0)',
    },
  }
}
