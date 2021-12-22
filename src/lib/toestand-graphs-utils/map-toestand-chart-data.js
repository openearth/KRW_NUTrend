/* 

  sometimes labels are the year, sometimes labels is the locationIds
  if more that one locationIds is present then the lables becomes the location names
  Result will be like: 
  
    {
    percentage: {
      labels: []
      goedData: []
      matigData: []
      ontoereikendData: [],
      slectData: [],
    }
    aantal: {
      labels: []
      goedData: []
      matigData: []
      ontoereikendData: [],
      slectData: [],
    }
    },
   
  
*/
import checkForNull from './check-for-null'
export default((array ) => {
  let dataObject = {}

  array.forEach(({ data, plotId }) => {

    const aantal = plotId.includes('aantal')
    const percentage = plotId.includes('perc')
   

    
    const { timeSeries } = data
    
    let labels = []
    let goedData =  []
    let matigData = []
    let ontoereikendData = []
    let slechtData = []

    const locationIds = timeSeries.map(({ header }) => {
      const { locationId } = header
      return locationId
    })

    if (locationIds.length > 4) {
      labels = [ ...new Set(locationIds) ]
    }
    timeSeries.forEach(({ header, events })=>{
      const { parameterId } = header
      
      const goedClass = parameterId.includes('.G.')
      const matigClass = parameterId.includes('.M.')
      const ontoeClass = parameterId.includes('.O.')
      const slechtClass = parameterId.includes('.S.')

      events.forEach(({ date, value }) => {
        goedClass && locationIds.length === 4 ? (goedData.push(checkForNull(value)), labels.push(date.split('-')[0]))
        :goedClass && locationIds.length > 4 ? goedData.push(checkForNull(value))
        :matigClass? matigData.push(checkForNull(value)) 
        :ontoeClass ? ontoereikendData.push(checkForNull(value))
        :slechtClass ? slechtData.push(checkForNull(value)) : null
      })
    })
    //check for null values

    const seriesData =  {
        'labels': labels,
        'goedData':  goedData ,
        'matigData': matigData,
        'ontoereikendData': ontoereikendData,
        'slechtData':slechtData,

      }
  
   aantal ? dataObject.aantal = seriesData 
   : percentage ? dataObject.percentage = seriesData
   :null
    
    })

  return dataObject
    
})






