import $axios from '~/plugins/axios'

import mapTimeseriesToGraphData from '~/lib/map-timeseries-to-graph-data'

const { VUE_APP_API_VERSION } = process.env

export default {
  namespaced: true,

  state: () => ({
    graphData: [],
  }),

  getters: {},

  actions: {
    getGraphData({ commit, rootGetters }, payload) {
      if (!rootGetters['layers/activeService']?.components.length) {
        console.warn('No component layers available to retreive data for. Add them to services config.')
        return
      }

      const { components } = rootGetters['layers/activeService']
      const { id } = payload

      components.forEach(component => {
        const params = {
          ...component,
          locationIds: id,
        }

        return $axios
          .get(`/FewsWebServices/rest/fewspiservice/${ VUE_APP_API_VERSION }/timeseries`, { params })
          .then((response) => response?.data)
          .then(mapTimeseriesToGraphData)
          .then(({ data, location }) => {
            commit('SET_GRAPH_DATA', { graphData: data })
            commit('layers/SET_ACTIVE_MAP_LOCATION', { activeMapLocation: location }, { root: true })
          })
      })
    },
    setGraphData(context, payload) {
      context.commit('SET_GRAPH_DATA', payload)
    },
    resetGraphs(context) {
      context.commit('RESET_GRAPHS')
    },
  },

  mutations: {
    SET_GRAPH_DATA(state, { graphData }) {
      state.graphData = graphData
    },
    RESET_GRAPHS(state) {
      state.graphs = []
    },
  },
}
