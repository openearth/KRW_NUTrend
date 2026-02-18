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
  
  array.forEach((item) => {
    
    const { name, result, seriesDetails } = item
   
    const { data, value, location } = result
    
    if (name === 'scatter') {
      
      mappedData.push({
        name,
        ...(location && { location }), 
        ...(data && { series: data }),
        ...(value && { areas: [ { value } ] }),
      }) 
    }else{
      const existingEntry = mappedData.find(item => item.name === name)

      
      // if an entry (with entry I mean lines, dots, etc.) already exists in mappedData, add the data to it.
      if (existingEntry) {
        
        if (value) {
          
          existingEntry.areas
            ? existingEntry.areas.push({ value })
            : existingEntry.areas = [ { value } ]
        }

        if (data) {
          // For lines chart, attach seriesDetails directly to the series entry
          if (name === 'lines' && seriesDetails) {
            const seriesEntry = {
              data: data,
              seriesName: seriesDetails.name,
              seriesColor: seriesDetails.color,
            }
            existingEntry.series
              ? existingEntry.series.push(seriesEntry)
              : existingEntry.series = [ seriesEntry ]
          } else {
            existingEntry.series
              ? existingEntry.series.push(data)
              : existingEntry.series = [ data ]
          }

          existingEntry.minValues
          ? existingEntry.minValues.push(location.minValue)
          : existingEntry.minValues = [ location.minValue ]

          existingEntry.maxValues
          ? existingEntry.maxValues.push(location.maxValue)
          : existingEntry.maxValues = [ location.maxValue ]
        }

      } else {
       
        // else, we create a new entry in mappedData and add the available data.
        if (name === 'lines') {
          const seriesData = data && seriesDetails
            ? [ {
              data: data,
              seriesName: seriesDetails.name,
              seriesColor: seriesDetails.color,
            } ]
            : (data ? [ data ] : [])
          
          mappedData.push({
            name,
            ...(seriesData.length > 0 && { series: seriesData }),
            ...(value && { areas: [ { value } ] }),
          })
        } else {
          mappedData.push({
            name,
            ...(data && { series:  data  }),
            ...(value && { areas: [ { value } ] }),
          })
        }
      }
      }

  })
  
  return {
    data: mappedData,
  }
}
