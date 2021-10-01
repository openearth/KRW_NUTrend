import $axios from '~/plugins/axios'

import getChartAreaFromTimeseries from '~/lib/get-chart-area-from-timeseries'
import mapTimeseriesToChartData from '~/lib/map-timeseries-to-chart-data'

const { VUE_APP_API_VERSION } = process.env

/**
 * For each set type of chart, create and make a request with each set of parameters.
 * Depending on the request response, we map the chart data series and chart area.
 *
 * Output: Array with Promises (resolved or rejected) fror each request.
 * [ Promise, Promise, Promise, ... ]
 */
export default ({ charts, id }) => {
  let requests = []

  Object.entries(charts).forEach(([ name, array ]) => {
    array.forEach((parameters) => {
      const hasAreaParameter = parameters?.moduleInstanceIds.includes('BerekenNormen')
      const params = {
        ...parameters,
        locationIds: id,
        documentFormat: 'PI_JSON',
      }
      const request = new Promise((resolve, reject) => {
        $axios
          .get(`/FewsWebServices/rest/fewspiservice/${ VUE_APP_API_VERSION }/timeseries`, { params })
          .then((response) => response?.data)
          .then((data) => hasAreaParameter
            ? getChartAreaFromTimeseries(data)
            : mapTimeseriesToChartData(data),
          )
          .then((result) => resolve({ name, result }))
          .catch((err) => reject(err))
      })

      requests.push(request)
    })
  })

  return requests
}
