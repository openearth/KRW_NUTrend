export default (geojson) => {
  const { features } = geojson
  if (!features.length) {
    return []
  }
  const st = require('geojson-bounds')
  return st.extent(geojson)
}