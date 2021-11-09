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
      params = {
        ...params,
        startTime: time,
        endTime: time,
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