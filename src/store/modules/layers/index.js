import $axios from '~/plugins/axios'

import services from '~/config/services.json'
import filterFeaturesCollection from '~/lib/filter-features-collection'
import mapTimeseriesToGeoJSON from '~/lib/map-timeseries-to-geojson'
import buildCirclesColor from '~/lib/build-circles-color'
import buildPaintObject from '~/lib/build-paint-object'
import buildPaintObjectDiffMaps from '~/lib/build-paint-object-diff-maps'

const { VUE_APP_API_VERSION } = process.env

export default {
  namespaced: true,

  state: () => ({
    activeMap: null,
    activeMapLocation: null,
    featuresCollection: [],
    legendGraphic: null,
    differenceMap: false,
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
        const circlesColor = buildCirclesColor(state.legendGraphic)
        const paint =  state.differenceMap ? { paint: buildPaintObjectDiffMaps(circlesColor) } : { paint: buildPaintObject(circlesColor) }
        console.log('{ ...state.activeMap, ...data, ...paint }', { ...state.activeMap, ...data, ...paint })
        return { ...state.activeMap, ...data, ...paint }
      }
    },
    activeService(state, getters, rootState) {
      const { selectedParticle, selectedType } = rootState.filters
      const { id } = state.activeMap

      const service = services.find(service => service.id === selectedType)
      const particle = service.spatialPlots.find(plot => plot.id === selectedParticle)

      return particle.services.find(service => service.id === id)
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
    getTimeSeriesDifferenceMaps({ commit, state }) {
      const { url } = state.activeMap
      return $axios
        .get(url)
        .then((response) => response?.data)
        .then(mapTimeseriesToGeoJSON)
        .then((timeSeries) => {
          commit('ADD_DATA_TO_ACTIVE_MAP', timeSeries)
        })
    },
    getLegendGraphic({ commit, state }) {
      const { legendGraphicId } = state.activeMap
      const params = { 
    	  request: 'GetLegendGraphic',
        service: 'WMS',
        format: 'application/json',
        layers: legendGraphicId,
      }
      return $axios
        .get('/FewsWebServices/wms?', { params })
        .then((response) => response?.data)
        .then((legend) => {
          commit('SET_LEGEND_GRAPHIC', legend)
        })
      
    },
    setActiveMap(context, payload) {
      context.commit('SET_ACTIVE_MAP', payload)
    },
    setActiveMapLocation(context, payload) {
      context.commit('SET_ACTIVE_MAP_LOCATION', payload)
    },
    setDifferenceMap(context, payload) {
      context.commit('SET_DIFFERENCE_MAP', payload)
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
      state.activeMapLocation = activeMapLocation
    },
    SET_LEGEND_GRAPHIC(state, legend) {
      state.legendGraphic = legend
    },
    SET_DIFFERENCE_MAP(state, boolean) {
      state.differenceMap = boolean
    },

  },
}
