/**
 * Filter out any location that has an empty 'attributes' array.
 */
export default (locations) => {
  if (!locations.length) {
    return []
  }

  return locations.filter(location => location?.attributes.length)
}
