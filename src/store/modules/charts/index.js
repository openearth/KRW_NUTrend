import createChartRequests from '~/lib/create-chart-requests'
import mapChartData from '~/lib/map-chart-data'

export default {
  namespaced: true,

  state: () => ({
    data: [],
  }),

  actions: {
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
            commit('layers/SET_ACTIVE_MAP_LOCATION', { activeMapLocation: location }, { root: true })
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
