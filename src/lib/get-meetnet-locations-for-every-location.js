/**
 * Get meetnet locations from locations response .
 *
 * Steps:
 * 1. Filter by relations that contain only meetnet
 * 2. Use .map() to return the meetnet locations and the waterbodies that have in their relations
 * 3. Filter by attributues OWMIDENT to get the waterbodyLocations
 * 4. Map every waterbody and filter the meetnetLocations if the include the waterbody in their array of waterbodies
 * 

 */
export default (locations) => {
    if (!locations.length) {
      return []
    }
  
    

    const filterByMeetnetParent = ({ id }) => id.includes('meetnet') === true 
      
     
    const meetnetLocations = locations
    .filter(({ relations }) => relations.find(filterByMeetnetParent))
      .map((location) => {
        
        const meetnetLocationId = location.locationId
        const meetnetLocationName = location.attributes[1].value
                                       
        const waterbodies = location.relations
                            .map((relation) => {
                              return relation.relatedLocationId})
        return {
          'meetnetLocationId': meetnetLocationId,
          'meetnetLocationName': meetnetLocationName,
          'waterbodies': waterbodies,
        }
      
      })
    
  
    const filterByBodyOfWater = ({ name }) => name === 'OWMIDENT'
    const waterbodyLocations = locations
      .filter(({ attributes }) => attributes.find(filterByBodyOfWater))
      .map(({ attributes }) => {
        const match = attributes.find(filterByBodyOfWater)
        return match?.value || null
      })
   
  
    const waterbodiesWithMeetnetLocations = waterbodyLocations
                                                .map((waterbody)=> {
                                                  
                                                  const filteredMeetnetLocations = meetnetLocations
                                                    .filter((monLoc) =>{
                                                      return monLoc.waterbodies.includes(waterbody)
                                                    })
                                                  
                                                  return {
                                                    'waterbody': waterbody,
                                                    'meetnetLocations': filteredMeetnetLocations,
                                                  }
                                                  
                                                })
    
    return waterbodiesWithMeetnetLocations
  }
  