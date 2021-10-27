import { active } from 'sortablejs'
import $axios from '~/plugins/axios'

import capitalizeString  from '~/lib/capitalize-string'
import createChartRequests from '~/lib/create-chart-requests'
import mapChartData from '~/lib/map-chart-data'

export default {
  namespaced: true,

  state: () => ({
    data: [],
    image: null,
  }),

  actions: {
    //TODO in the payload there is no locationId anymore. Extract it similar with getChartData.
    //TODO baseUrl load it from services.json
    createImageUrl({ commit, rootState }) {
      const { activeMapLocation } = rootState.layers
      const { locationId } = activeMapLocation
     
      const { selectedParticle } = rootState['filters']
      const type = capitalizeString(selectedParticle)

      const imageUrl =  `https://krw-nutrend.nl/site/data/trend-graph-per-location/Trend-${ locationId }%20-%20${ type }.jpg`
      commit('SET_CHART_IMAGE', imageUrl)
      //TODO replace baseUrl with url from services.json
/*       try {
        $axios({
          method: 'get',
          baseURL: `https://krw-nutrend.nl/site/data/trend-graph-per-location/Trend-${ locationId }%20-%20${ type }.jpg`,
          // Set correct content-type, using 'image/jpeg' for now.
          headers: { 'Content-type': 'image/jpeg' },
        })
          .then((response) => response?.data)
          .then((data) => {
            // Commit image response to store. We might need to do some base64 encoding.
            commit('SET_CHART_IMAGE', { image: data })
          })
      } catch (err) {
        console.log(err)
      } */
    },
    getChartsData({ commit, rootState, rootGetters }) {
      const charts  = rootGetters['layers/availableCharts']

      if (!charts) {
        console.warn('No chart parameters available to retreive data with.')
        return
      }
      const { activeMapLocation } = rootState.layers
     
      const { locationId } = activeMapLocation
      const  selectedMonitoringLocations = rootGetters['locations/selectedMonitoringLocations']
      const chartDataRequests = createChartRequests({ charts, locationId, selectedMonitoringLocations }) 

      try {
        Promise.all(chartDataRequests)
          .then((result) => mapChartData(result))
          .then(({ data }) => {
            commit('SET_CHART_DATA', { data })
          })
      } catch (err) {
        console.log(err)
      }
    },
    resetChartsData({ commit }) {
      commit('RESET_CHART_DATA')
    },
  },

  mutations: {
    SET_CHART_DATA(state, { data }) {
      state.data = data
    },
    SET_CHART_IMAGE(state, image ) {
      state.image = image
    },
    RESET_CHART_DATA(state) {
      state.data = []
    },
    RESET_CHART_IMAGE(state) {
      state.image = null
    },
  },
}
