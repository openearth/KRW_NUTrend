export default (data) => {
  if (!data?.timeSeries.length) {
    return []
  }
  const features = data.timeSeries.map(({ events, header }) => ({
    type: 'Feature',
    properties: {
      locationId: header.locationId,
      value: events ? parseFloat(events[0].value) : 'null',
      value2: events ? events[events.length - 1].value : 'null',
      name: header.stationName,
    },
    geometry: {
      type: 'Point',
      coordinates: [ header.lon, header.lat ],
    },
  }))
 
  return {
    type: 'FeatureCollection',
    features,
  }
}
