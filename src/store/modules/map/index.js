export default {
  namespaced: true,

  state: () => ({
    wmsLayers: [],
  }),

  actions: {
    setWmsLayers(context, payload) {
      context.commit('SET_WMS_LAYERS', payload)
    },
  },

  mutations: {
    SET_WMS_LAYERS(state, { wmsLayers }) {
      state.wmsLayers = wmsLayers
    },
  },
}
