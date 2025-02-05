import $axios from '~/plugins/axios'

const { VUE_APP_API_VERSION } = process.env

export default((charts, time=null, locations=null) => {
  
  let requests = []
  charts.forEach((parameters) => {
    const { plotId } = parameters
    

    let params = {
      ...parameters,
      documentFormat:'PI_JSON',
    }
    if (time) {
      //NOTE: When making a few request with a startTime and endTime that do not match exactly what is available we we two values instead of one, messing up the visualisation. It is now patched by requesting data from 31-12-23:00:00 of the previous year to be plotted instead of from 01-01-00:00:00 since that gives two results.
      
      // Trim spaces and ensure valid date format
      const sanitizedTime = time.replace(/\s+/g, '')
      const date = new Date(sanitizedTime)
      
      if (!isNaN(date.getTime())) {
        date.setHours(date.getHours() - 1)
        const adjustedTime = date.toISOString()
        
        params = {
          ...params,
          startTime: adjustedTime,
          endTime: adjustedTime,
        }
      } else {
        console.error('Invalid time value after sanitization:', sanitizedTime)
      }
    }
    if (locations) {
      params = { 
        ...params,
        locationIds: locations,
      }
    }
    const request = new Promise((resolve, reject) => {
        $axios
          .get(`/FewsWebServices/rest/fewspiservice/${ VUE_APP_API_VERSION }/timeseries/displaygroups?`, { params })
          .then((response) => response?.data)
          .then((data) => resolve({ plotId, data }))
          .catch((err) => reject(err))
      })
    
    requests.push(request)
  })
  return requests
})