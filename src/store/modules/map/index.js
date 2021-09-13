import $axios from '~/plugins/axios'

import mapTimeseriesToGeoJSON from '~/lib/map-timeseries-to-geojson'

export default {
  namespaced: true,

  state: () => ({
    activeMapLayer: null,
    mapLayerData: null,
    wmsLayers: [],
  }),

  actions: {
    getTimeSeries(context, payload) {
      const { url } = payload

      return $axios.get(url)
        .then(response => response?.data)
        .then(mapTimeseriesToGeoJSON)
        .then(json => context.commit('SET_MAP_LAYER_DATA', { mapLayerData: json }))
    },
    setWmsLayers(context, payload) {
      context.commit('SET_WMS_LAYERS', payload)
    },
    setActiveMapLayer(context, payload) {
      context.commit('SET_ACTIVE_MAP_LAYER', payload)
    },
  },

  mutations: {
    SET_ACTIVE_MAP_LAYER(state, { activeMapLayer }) {
      state.activeMapLayer = activeMapLayer
    },
    SET_MAP_LAYER_DATA(state, { mapLayerData }) {
      state.mapLayerData = mapLayerData
    },
    SET_WMS_LAYERS(state, { wmsLayers }) {
      state.wmsLayers = wmsLayers
    },
  },
}
