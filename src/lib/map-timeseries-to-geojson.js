import checkForNullMaps from './check-for-null-maps'
export default (data) => {
  
  if (!data?.timeSeries.length) {
    return []
  }
 
  const features = data.timeSeries.map(({ events, header }) => ({
    type: 'Feature',
    properties: {
      locationId: header.locationId,
      value: checkForNullMaps(events[0].value),
      value2: checkForNullMaps(events[events.length - 1].value),
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
