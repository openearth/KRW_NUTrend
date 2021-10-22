import getChartDataRequest from '~/lib/get-chart-data-request'
/**
 * For each set type of chart, create and make a request with each set of parameters.
 * Depending on the request response, we map the chart data series and chart area.
 *
 * Output: Array with Promises (resolved or rejected) fror each request.
 * [ Promise, Promise, Promise, ... ]
 */
export default ({ charts, locationId, selectedMonitoringLocations }) => {
  let requests = []
 
  const { monitoringLocations }= selectedMonitoringLocations
  
  Object.entries(charts).forEach(([ name, array ]) => {
    if (name ==='scatter') {
      monitoringLocations.forEach(({ monitoringLocationId }) => {
        let requestScatter = getChartDataRequest(name, array, monitoringLocationId)
        
        requests = [ ...requests, ...requestScatter ]
      })
      
      
    }else{
      let requestsChart = getChartDataRequest(name, array, locationId)
      requests = [ ...requests, ...requestsChart ]
    }
  })
  
  return requests
}
