import { active } from 'sortablejs'
import $axios from '~/plugins/axios'

import capitalizeString  from '~/lib/capitalize-string'
import createChartRequests from '~/lib/create-chart-requests'
import mapChartData from '~/lib/map-chart-data'

export default {
  namespaced: true,

  state: () => ({
    data: [], //TODO rename to data for concentratie charts
    image: null,
  }),
  getters:{
    showToestandGraphs(state, getters, rootState, rootGetters) {
      const { selectedType } = rootState.filters
      const { activeMapLocation } = rootState.layers
      const availableCharts = rootGetters['layers/availableCharts']
      const activeService = rootGetters['layers/activeService']
       
      const show = selectedType === 'state' 
          && activeService 
          && !activeMapLocation 
         ? true : false //  && availableCharts
      return  show 
       

    },
    showTrendsGraphs(state, getters, rootState, rootGetters) { 
      const { selectedType } = rootState.filters
      const { activeMapLocation } = rootState.layers
      const availableCharts = rootGetters['layers/availableCharts']
      
      const show = selectedType === 'trends' 
          && activeMapLocation
          && availableCharts ? true : false
      return show

    },
    showConcentrationGraphs(state, getters, rootState, rootGetters) { 
      const { selectedType } = rootState.filters
      const { activeMapLocation } = rootState.layers
      const availableCharts = rootGetters['layers/availableCharts']
      const show = selectedType === 'concentration' 
          && activeMapLocation 
          && availableCharts ? true : false
      return show
    },
    showToestandGraphNl(state, getters, rootState, rootGetters) {
      const { showToestandGraphs } = getters
      const { selectedBasin, selectedWaterManager } = rootState.filters
      if (showToestandGraphs & !selectedBasin & !selectedWaterManager) {
        return true
      }
    },
    showToestandGraphAllBasins(state, getters, rootState, rootGetters) {
      const { showToestandGraphs } = getters
      const { selectedBasin, selectedWaterManager } = rootState.filters
      if (showToestandGraphs & !selectedBasin & !selectedWaterManager) {
        return true
      }

    },
    showToestandGraphAllWatermanagers(state, getters, rootState, rootGetters) {
      const { showToestandGraphs } = getters
      const { selectedBasin, selectedWaterManager } = rootState.filters
      if (showToestandGraphs && !selectedWaterManager) {
        return true
      }
    },
    showToestandGraphSelectedBasin(state, getters, rootState, rootGetters) {
      const { showToestandGraphs } = getters
      const { selectedBasin, selectedWaterManager } = rootState.filters
      if (showToestandGraphs && selectedBasin && !selectedWaterManager) {
        return true
      }
    },
    showToestandGraphSelectedWaterManager(state, getters, rootState, rootGetters) {
      const { showToestandGraphs } = getters
      const { selectedBasin, selectedWaterManager } = rootState.filters
      if (showToestandGraphs && selectedWaterManager) {
        return true
      }
    },

  },

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
    },
    getChartsData({ commit, rootState, rootGetters }) {
      const charts  = rootGetters['layers/availableCharts']
      console.log('charts', charts)

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
    getChartDataToestandNl() {

    },
    resetChartsData({ commit }) {
      commit('RESET_CHART_DATA')
    },
    resetImageData({ commit }) {
      commit('RESET_IMAGE_DATA')
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
