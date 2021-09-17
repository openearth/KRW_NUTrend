export default (timeseries) => {
  const geojson = {
    type: "FeatureCollection",
    features: timeseries.map((waterbody) => ({
      type: "Feature",
      properties: {
        locationId: waterbody.header.locationId,
        value: waterbody.events[0].value,
      },
      geometry: {
        type: "Point",
        coordinates: [ waterbody.header.lon, waterbody.header.lat ],
      },
    })),
  }
  return geojson
}


