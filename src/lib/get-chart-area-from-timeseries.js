/**
 *
 */
export default (data) => {
  if (!data?.timeSeries.length) {
    return []
  }

  // Since all values are the same, just return the first item.
  const firstItem = [ ...data.timeSeries[0].events ].shift()

  return { value: firstItem.value }
}
