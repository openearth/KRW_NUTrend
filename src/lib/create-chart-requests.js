import getChartDataRequest from '~/lib/get-chart-data-request'
/**
 * For each set type of chart, create and make a request with each set of parameters.
 * Depending on the request response, we map the chart data series and chart area.
 *
 * Output: Object with arrays of Promises grouped by chart type.
 * { 
 *   lines: [ Promise, Promise, ... ],
 *   dots: [ Promise, Promise, ... ],
 *   scatter: [ Promise, Promise, ... ],
 * }
 */
export default ({ charts, locationId, selectedMonitoringLocations, selectedMeetnetLocations }) => {
  const requestsByType = {}
  const { monitoringLocations }= selectedMonitoringLocations || {}
  const { meetnetLocations }= selectedMeetnetLocations || {}
  
  Object.entries(charts).forEach(([ name, array ]) => {
    
    if (name ==='scatter') {
      requestsByType[name] = []
      
      if (monitoringLocations && monitoringLocations.length > 0) {
        monitoringLocations.forEach(({ monitoringLocationId }) => {
          let requestScatter = getChartDataRequest(name, array.monitoring, monitoringLocationId)        
          requestsByType[name] = [ ...requestsByType[name], ...requestScatter ]
        })
      }
      if (meetnetLocations && meetnetLocations.length > 0) {
        meetnetLocations.forEach(({ meetnetLocationId }) => {
          let requestScatter = getChartDataRequest(name, array.meetnet, meetnetLocationId)        
          requestsByType[name] = [ ...requestsByType[name], ...requestScatter ]
        })
      }
      
    } else {
      let requestsChart = getChartDataRequest(name, array, locationId)
      requestsByType[name] = requestsChart
    }
  })
  
  return requestsByType
}
