
import capitalizeString  from '~/lib/capitalize-string'
import createChartRequests from '~/lib/create-chart-requests'
import mapChartData from '~/lib/map-chart-data'
import createToestandChartRequests from '~/lib/toestand-graphs-utils/create-toestand-chart-requests'
import mapToestandChartData from '~/lib/toestand-graphs-utils/map-toestand-chart-data'
import timespan from '~/config/timespan.json'

//TODO: change showTrendsGraphs and showConcentratieGraphs to modal.
export default {
  namespaced: true,

  state: () => ({
    data: [], //TODO rename to data for concentratie charts
    image: null,
    toestandDataNl: null,
    toestandDataAllBasins: [], 
    toestandDataAllSubBasins: [],
    toestandDataAllWaterManagers: [], // TODO rename to waterManagers
    toestandDataSelectedBasin: null,
    toestandDataSelectedSubBasin: null,
    toestandDataSelectedWaterManager: null,
   
  }),
  getters:{
    showToestandGraphs(state, getters, rootState, rootGetters) {
      const { selectedType } = rootState.filters
      const { activeMapLocation } = rootState.layers
      const availableCharts = rootGetters['layers/availableCharts']
      const activeService = rootGetters['layers/activeService']
       
      const show = selectedType === 'state' 
          && activeService 
          && !activeMapLocation && availableCharts
         ? true : false 
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
    showToestandGraphNlModal(state, getters, rootState, rootGetters) {
      const { showToestandGraphs } = getters
      const { selectedBasin, selectedWaterManager } = rootState.filters
      if (showToestandGraphs & !selectedBasin & !selectedWaterManager) {
        return true
      }
    },
    showToestandGraphAllBasinsModal(state, getters, rootState, rootGetters) {
      const { showToestandGraphs } = getters
      const { selectedBasin, selectedWaterManager } = rootState.filters
      if (showToestandGraphs & !selectedBasin & !selectedWaterManager) {
        return true
      }
    },
    showToestandGraphAllSubBasinsModal(state, getters, rootState, rootGetters) {
      const { showToestandGraphs } = getters
      const { selectedBasin, selectedWaterManager } = rootState.filters
      if (showToestandGraphs & !selectedBasin & !selectedWaterManager) {
        return true
      }
    },
    showToestandGraphAllWatermanagersModal(state, getters, rootState, rootGetters) {
      const { showToestandGraphs } = getters
      const { selectedBasin, selectedWaterManager } = rootState.filters
      if (showToestandGraphs && !selectedWaterManager) {
        return true
      }
    },
    showToestandGraphSelectedBasinModal(state, getters, rootState, rootGetters) {
      const { showToestandGraphs } = getters
      const { selectedBasin, selectedWaterManager } = rootState.filters
      if (showToestandGraphs && selectedBasin && !selectedWaterManager) {
        return true
      }
    },
    showToestandGraphSelectedSubBasinModal(state, getters, rootState, rootGetters) {
      const { showToestandGraphs } = getters
      const { selectedSubBasin, selectedWaterManager } = rootState.filters
      if (showToestandGraphs && selectedSubBasin && !selectedWaterManager) {
        return true
      }
    },
    showToestandGraphSelectedWaterManagerModal(state, getters, rootState, rootGetters) {
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
    getChartDataToestandNl(context) {
      const { showToestandGraphNlModal } = context.getters
      if (!showToestandGraphNlModal) {
        return
      }
      const availableCharts = context.rootGetters['layers/availableCharts']
      const { NL_charts } = availableCharts
      const requests = createToestandChartRequests(NL_charts)
      
      try {
        Promise.all(requests)
          .then((result) => mapToestandChartData(result))
          .then(( data ) => {
            context.commit('SET_TOESTAND_DATA_NL', data)
          })
      } catch (err) {
        console.log(err)
      }
    },
    getChartDataToestandAllBasins(context) {
      const { showToestandGraphAllBasinsModal } = context.getters
      if (!showToestandGraphAllBasinsModal) {
        return
      }
      const availableCharts = context.rootGetters['layers/availableCharts']
      const { Basins_charts } = availableCharts
      
      let chartData = new Array()

      timespan.forEach(async time =>{
        const requests = createToestandChartRequests(Basins_charts, time)
        try {
          Promise.all(requests)
            .then((result) => mapToestandChartData(result))
            .then(( data ) => {
              const yearlyData = {
                year: time,
                data,
              }
              chartData.push(yearlyData)
            })
        } catch (err) {
          console.log(err)
        }
      })

      context.commit('SET_TOESTAND_DATA_ALL_BASINS', chartData)
    },
    getChartDataToestandAllSubBasins(context) {
      const { showToestandGraphAllBasinsModal } = context.getters
      if (!showToestandGraphAllBasinsModal) {
        return
      }
      const availableCharts = context.rootGetters['layers/availableCharts']
      const { SubBasins_charts } = availableCharts
  
      let chartData = new Array()

      timespan.forEach(async time =>{
        const requests = createToestandChartRequests(SubBasins_charts, time)
        try {
          Promise.all(requests)
            .then((result) => mapToestandChartData(result))
            .then(( data ) => {
              const yearlyData = {
                year: time,
                data,
              }
              chartData.push(yearlyData)
            })
        } catch (err) {
          console.log(err)
        }
      })

      context.commit('SET_TOESTAND_DATA_ALL_SUB_BASINS', chartData)
    },
    getChartDataToestandAllWaterManagers(context) {
      const { showToestandGraphAllBasinsModal } = context.getters
      if (!showToestandGraphAllBasinsModal) {
        return
      }
      const availableCharts = context.rootGetters['layers/availableCharts']
      const { WaterManagers_charts } = availableCharts
      
      let chartData = []
      timespan.forEach((time)=>{
        const requests = createToestandChartRequests(WaterManagers_charts, time)
        try {
          Promise.all(requests)
            .then((result) => mapToestandChartData(result))
            .then(( data ) => {
              const yearlyData = {
                year: time,
                data,
              }
              chartData.push(yearlyData)
            })
        } catch (err) {
          console.log(err)
        }
      })
     
      context.commit('SET_TOESTAND_DATA_ALL_WATER_MANAGERS', chartData)
    },
    getChartDataToestandSelectedBasin(context) {
      const { showToestandGraphSelectedBasinModal } = context.getters
      if (!showToestandGraphSelectedBasinModal) {
        return
      }
      const availableCharts = context.rootGetters['layers/availableCharts']
      const { SelectedBasin_charts } = availableCharts
      const { selectedBasin } = context.rootState.filters
      const requests = createToestandChartRequests(SelectedBasin_charts, null, [ selectedBasin ] )
     
      
      try {
        Promise.all(requests)
          .then((result) => mapToestandChartData(result))
          .then(( data ) => {
            context.commit('SET_TOESTAND_DATA_SELECTED_BASIN', data)
          })
      } catch (err) {
        console.log(err)
      }
    },
    getChartDataToestandSelectedSubBasin(context) {
      const { showToestandGraphSelectedBasinModal } = context.getters
      if (!showToestandGraphSelectedBasinModal) {
        return
      }
      const availableCharts = context.rootGetters['layers/availableCharts']
      const { SelectedSubBasin_charts } = availableCharts 
      const { selectedSubBasin } = context.rootState.filters
      const requests = createToestandChartRequests(SelectedSubBasin_charts, null, [ selectedSubBasin ] )
     
      
      try {
        Promise.all(requests)
          .then((result) => mapToestandChartData(result))
          .then(( data ) => {
            context.commit('SET_TOESTAND_DATA_SELECTED_SUB_BASIN', data)
          })
      } catch (err) {
        console.log(err)
      }
    },
    
    getChartToestandAvailableWaterManagers(context) {
      /*
      * When we select basin/sub basin case
      */ 
      const { showToestandGraphSelectedBasinModal } = context.getters
      if (!showToestandGraphSelectedBasinModal) {
        return
      }
      const { selectedBasin, selectedSubBasin } = context.rootState.filters
      const basin = selectedSubBasin ? selectedSubBasin 
                          :selectedBasin ? selectedBasin
                          :null
      const availableCharts = context.rootGetters['layers/availableCharts']
      const { AvailableWaterManagers_charts } = availableCharts
      //const availableWaterManagers = context.rootGetters['filters/availableWaterManagers']
      
       const params = AvailableWaterManagers_charts.map((chart) => {
          const { plotId } = chart
          chart.plotId = plotId.replace('{name}', basin)
          return chart
        })


      let chartData = []
      timespan.forEach((time)=>{
        const requests = createToestandChartRequests(params, time)
        try {
          Promise.all(requests)
            .then((result) => mapToestandChartData(result))
            .then(( data ) => {
              const yearlyData = {
                year: time,
                data,
              }
              chartData.push(yearlyData)
            })
        } catch (err) {
          console.log(err)
        }
      })
 
      context.commit('SET_TOESTAND_DATA_ALL_WATER_MANAGERS', chartData)

    },
    getChartDataToestandSelectedWaterManager(context) {
      /** 
       * Case 1: If a basin or subbasin has been already selected
       * Case 2: If no basin has been selected
      */
      
      const { showToestandGraphSelectedWaterManagerModal } = context.getters
      if (!showToestandGraphSelectedWaterManagerModal) {
        return
      }
      
      const availableCharts = context.rootGetters['layers/availableCharts']
      let requests
      const { selectedBasin, selectedSubBasin } = context.rootState.filters
      const { selectedWaterManager } = context.rootState.filters
      const basin = selectedSubBasin ? selectedSubBasin 
                          :selectedBasin ? selectedBasin
                          :null
     
      
      const { SelectedWaterManagerCase1_charts, SelectedWaterManagerCase2_charts } = availableCharts
      
      if (basin) {
        //Case 1
        const params = SelectedWaterManagerCase1_charts.map((chart) => {
          const { plotId } = chart
          chart.plotId = plotId.replace('{name}', basin)
          return chart
        })
        requests = createToestandChartRequests(params, null, [ `${ basin }: ${ selectedWaterManager }` ])
      }else{
        //Case 2
        requests = createToestandChartRequests(SelectedWaterManagerCase2_charts, null, [ selectedWaterManager ])
      }
     
      
      try {
        Promise.all(requests)
          .then((result) => mapToestandChartData(result))
          .then(( data ) => {
            context.commit('SET_TOESTAND_DATA_SELECTED_WATER_MANAGER', data)
          })
      } catch (err) {
        console.log(err)
      }
    },

    resetChartsData({ commit }) {
      commit('RESET_CHART_DATA')
      commit('RESET_CHART_IMAGE')
      commit('RESET_TOESTAND_DATA_NL')
      commit('RESET_TOESTAND_DATA_ALL_BASINS')
      commit('RESET_TOESTAND_DATA_WATER_MANAGERS')
      commit('RESET_TOESTAND_DATA_SELECTED_BASIN')
      commit('RESET_TOESTAND_DATA_SELECTED_WATER_MANAGER')
      commit('RESET_TOESTAND_DATA_ALL_SUB_BASINS')
      commit('RESET_TOESTAND_DATA_SELECTED_SUB_BASIN')
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
    RESET_TOESTAND_DATA_NL(state) {
      state.toestandDataNl = null
    },
    RESET_TOESTAND_DATA_ALL_BASINS(state) {
      state.toestandDataAllBasins = []
    },
    RESET_TOESTAND_DATA_WATER_MANAGERS(state) {
      state.toestandDataAllWaterManagers =[]
    },
    RESET_TOESTAND_DATA_SELECTED_BASIN(state) {
      state.toestandDataSelectedBasin =null
    },
    RESET_TOESTAND_DATA_SELECTED_SUB_BASIN(state) {
      state.toestandDataSelectedSubBasin =null
    },
    RESET_TOESTAND_DATA_ALL_SUB_BASINS(state) {
      state.toestandDataAllSubBasins = []
    },
    RESET_TOESTAND_DATA_SELECTED_WATER_MANAGER(state) {
      state.toestandDataSelectedWaterManager = null
    },
    SET_TOESTAND_DATA_NL(state,  data ) {
      state.toestandDataNl = data
    },
    SET_TOESTAND_DATA_ALL_BASINS(state, data) {
      state.toestandDataAllBasins = data //todo change to simple basins the name
    },
    SET_TOESTAND_DATA_ALL_SUB_BASINS(state, data) {
      state.toestandDataAllSubBasins = data
    },
    SET_TOESTAND_DATA_ALL_WATER_MANAGERS(state,  data ) {
      state.toestandDataAllWaterManagers = data
    },
    SET_TOESTAND_DATA_SELECTED_BASIN(state, data) {
      state.toestandDataSelectedBasin = data
    },
    SET_TOESTAND_DATA_SELECTED_WATER_MANAGER(state, data) {
      state.toestandDataSelectedWaterManager = data
    },
    SET_TOESTAND_DATA_SELECTED_SUB_BASIN(state, data) {
      state.toestandDataSelectedSubBasin = data
    },

  },
}
