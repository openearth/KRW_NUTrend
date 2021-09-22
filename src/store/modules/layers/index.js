import $axios from '~/plugins/axios'

import filterFeaturesCollection from '~/lib/filter-features-collection'
import mapTimeseriesToGeoJSON from '~/lib/map-timeseries-to-geojson'

const { VUE_APP_API_VERSION } = process.env

export default {
  namespaced: true,

  state: () => ({
    activeMapLayer: null,
    mapLayerData: null,
    featuresCollection: [],
  }),

  getters: {
    availableLayer(state, getters, rootState, rootGetters) {
      const waterBodies = rootGetters['filters/availableWaterBodies']
      const { selectedBodyOfWater } = rootState.filters
      const layer = state.activeMapLayer
      if (layer && layer.data) {
        const featuresCollection = filterFeaturesCollection(
          layer.data,
          waterBodies,
          selectedBodyOfWater,
        )
        const data = { data: featuresCollection }
        return { ...layer, ...data }
      }
    },
  },

  actions: {
    getTimeSeries({ commit, state, rootState }) {
      const { id } = state.activeMapLayer
      const { selectedTimestamp } = rootState.filters
      const params = {
        filterId: id,
        startTime: selectedTimestamp,
        endTime: selectedTimestamp,
        documentFormat: 'PI_JSON',
      }
      return $axios
        .get(`/FewsWebServices/rest/fewspiservice/${ VUE_APP_API_VERSION }/timeseries`, { params })
        .then(response => response?.data)
        .then(mapTimeseriesToGeoJSON)
        .then((timeSeries) => {
          commit('ADD_FEATURES_TO_ACTIVE_MAP_LAYER', timeSeries)
        })
    },
    getTimeSeriesDifferenceMaps({ commit, state }) { 
      const { url } = state.activeMapLayer
      return $axios
        .get(url)
        .then((response) => response?.data)
        .then(mapTimeseriesToGeoJSON)
        .then((timeSeries) => {
          commit('ADD_FEATURES_TO_ACTIVE_MAP_LAYER', timeSeries)
        })
    },
    setActiveMapLayer(context, payload) {
      context.commit('SET_ACTIVE_MAP_LAYER', payload)
    },
  },

  mutations: {
    ADD_FEATURES_TO_ACTIVE_MAP_LAYER(state, features) {
      const data = { data: features }
      state.activeMapLayer = { ...state.activeMapLayer, ...data }
    },
    SET_ACTIVE_MAP_LAYER(state, { activeMapLayer }) {
      state.activeMapLayer = activeMapLayer
    },
    SET_MAP_LAYER_DATA(state, { mapLayerData }) {
      state.mapLayerData = mapLayerData
    },
  },
}
