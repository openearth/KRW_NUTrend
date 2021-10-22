import { active } from 'sortablejs'
import createChartRequests from '~/lib/create-chart-requests'
import mapChartData from '~/lib/map-chart-data'

export default {
  namespaced: true,

  state: () => ({
    data: [],
  }),

  actions: {
    getChartsData({ commit, rootState, rootGetters }) {
      
      if (!Object.keys(rootGetters['layers/activeService']?.charts).length) {
        console.warn('No chart parameters available to retreive data with. Add them to services config.')
        return
      }
      const { activeMapLocation } = rootState.layers
     
      const { charts } = rootGetters['layers/activeService']
      
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
    RESET_CHART_DATA(state) {
      state.data = []
    },
  },
}
