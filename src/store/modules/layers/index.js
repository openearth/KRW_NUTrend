import $axios from '~/plugins/axios'

import filterFeaturesCollection from '~/lib/filter-features-collection'
import mapTimeseriesToGeoJSON from '~/lib/map-timeseries-to-geojson'

const { VUE_APP_API_VERSION } = process.env

export default {
  namespaced: true,

  state: () => ({
    activeMap: null,
    activeMapLocation: null,
    featuresCollection: [],
  }),

  getters: {
    filteredMap(state, getters, rootState, rootGetters) {
      const waterBodies = rootGetters['filters/availableWaterBodies']
      const { selectedBodyOfWater } = rootState.filters

      if (state.activeMap?.data) {
        const featuresCollection = filterFeaturesCollection(
          state.activeMap.data,
          waterBodies,
          selectedBodyOfWater,
        )
        const data = { data: featuresCollection }
        return { ...state.activeMap, ...data }
      }
    },
  },

  actions: {
    getTimeSeries({ commit, state, rootState }) {
      const { id } = state.activeMap
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
          commit('ADD_DATA_TO_ACTIVE_MAP', timeSeries)
        })
    },
    getTimeSeriesDifferenceMaps({ commit, state, getters }) {
      console.log(getters)
      const { url } = state.activeMap
      return $axios
        .get(url)
        .then((response) => response?.data)
        .then(mapTimeseriesToGeoJSON)
        .then((timeSeries) => {
          commit('ADD_DATA_TO_ACTIVE_MAP', timeSeries)
        })
    },
    setActiveMap(context, payload) {
      context.commit('SET_ACTIVE_MAP', payload)
    },
    setActiveMapLocation(context, payload) {
      context.commit('SET_ACTIVE_MAP_LOCATION', payload)
    },
  },

  mutations: {
    ADD_DATA_TO_ACTIVE_MAP(state, features) {
      const data = { data: features }
      state.activeMap = { ...state.activeMap, ...data }
    },
    SET_ACTIVE_MAP(state, { activeMap }) {
      state.activeMap = activeMap
    },
    SET_ACTIVE_MAP_LOCATION(state, { activeMapLocation }) {
      console.log(activeMapLocation)
      state.activeMapLocation = activeMapLocation
    },
  },
}
