/**
 * Map all the chart data into a structure that we can easily use with our charts.
 *
 * Output example:
 * [
 *   {
 *     name: "dots",
 *     series: [
 *       [
 *         {
 *           label: "1990",
 *           value: "0.96"
 *         },
 *         {
 *           label: "1991",
 *           value: "0.85"
 *         }
 *       ],
 *       [ ... ],
 *     ],
 *     areas: [
 *       { value: "1.5" },
 *       { value: "2.5" },
 *       ...
 *     ],
 *   },
 *   {
 *     name: "lines",
 *     series: [...],
 *     areas: [...],
 *   },
 *   ...
 * ]
 */
export default (array) => {
  const mappedData = []
  let location = null

  array.forEach((item, index) => {
    const { name, result } = item
    const { data, value } = result
    const existingEntry = mappedData.find(item => item.name === name)

    if (index === 0 && result.location) {
      location = result.location
    }

    // if an entry already exists in mappedData, add the data to it.
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
      // else, we create a new entry in mappedData and add the available data.
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
