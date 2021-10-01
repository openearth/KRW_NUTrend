export default (array) => {
  const mappedData = []
  let location = null

  array.forEach((item, index) => {
    const { name, result } = item
    const existingEntry = mappedData.find(item => item.name === name)
    const { data, value } = result

    if (index === 0 && result.location) {
      location = result.location
    }

    if (existingEntry) {
      if (value) {
        existingEntry.areas
          ? existingEntry.areas.push({ value })
          : existingEntry.areas = [ { value } ]
      }

      if (data) {
        existingEntry.series
          ? existingEntry.series.push(data)
          : existingEntry.series = [ data ]
      }
    } else {
      mappedData.push({
        name,
        ...(data && { series: data }),
        ...(value && { areas: [ { value } ] }),
      })
    }
  })

  return {
    location,
    data: mappedData,
  }
}
