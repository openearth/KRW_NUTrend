/** 
 * Fitlers the array of the monitoringLocations based on the given locationId
 * */  

export default ((availableMonitoringLocations, locationId) => {
  if (!availableMonitoringLocations) {
    return []
  }
  return availableMonitoringLocations.find(location => location.waterbody === locationId)
})