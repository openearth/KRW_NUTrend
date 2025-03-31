/** 
 * Fitlers the array of the meetnet locations based on the given locationId
 * */  

export default ((availableMeetnetLocations, locationId) => {
    if (!availableMeetnetLocations) {
      return []
    }
    return availableMeetnetLocations.find(location => location.waterbody === locationId)
  })