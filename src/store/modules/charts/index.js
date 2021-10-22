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
    getChartImage({ commit, rootState }, payload) {
      const { id } = payload
      const location = { locationId: id, stationName: id }
      const { selectedParticle } = rootState['filters']
      const type = capitalizeString(selectedParticle)

      commit('layers/SET_ACTIVE_MAP_LOCATION', { activeMapLocation: location }, { root: true })

      try {
        $axios({
          method: 'get',
          baseURL: `https://krw-nutrend.nl/site/data/trend-graph-per-location/Trend-${ id }%20-%20${ type }.jpg`,
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
      }
    },
    getChartsData({ commit, rootGetters }, payload) {
      if (!Object.keys(rootGetters['layers/activeService']?.charts).length) {
        console.warn('No chart parameters available to retreive data with. Add them to services config.')
        return
      }

      const { charts } = rootGetters['layers/activeService']
      const { id } = payload
      const chartDataRequests = createChartRequests({ charts, id })

      try {
        Promise.all(chartDataRequests)
          .then((result) => mapChartData(result))
          .then(({ data, location }) => {
            commit('SET_CHART_DATA', { data })

            if (location) {
              commit('layers/SET_ACTIVE_MAP_LOCATION', { activeMapLocation: location }, { root: true })
            }
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
    SET_CHART_IMAGE(state, { image }) {
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
