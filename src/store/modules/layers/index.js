import $axios from '~/plugins/axios'

import services from '~/config/services.json'
import filterFeaturesCollection from '~/lib/filter-features-collection'
import mapTimeseriesToGeoJSON from '~/lib/map-timeseries-to-geojson'
import buildCirclesColor from '~/lib/build-circles-color'
import buildCirclesColorsRangeValues from '~/lib/build-circles-color-range-values'
import buildPaintObject from '~/lib/build-paint-object'
import mapTimeseriesToGeoJSONFloatValues from '~/lib/map-timeseries-to-geojson-float-values'
import createAvailableTimestamp from '~/lib/create-available-timestamp'
import WaterbeheerderContours from '~/config/Waterbeheerder_contours.json'
import buildBaseMapLayer from '~/lib/build-base-map-layer'
import buildGeojonLayer  from '~/lib/build-geojson-layer'
import getGeojsonBoundingBox from '~/lib/get-geojson-bounding-box'
import buildGeojsonLayerDiffMap from '~/lib/build-geojson-layer-diff-map'
import buildGeojsonLayerDiffMapsOuterCircle from '~/lib/build-geojson-layer-diff-maps-outer-circle'
import mapCsvFormatToTimeseries from '~/lib/map-csv-format-to-timeseries'


const { VUE_APP_API_VERSION } = process.env

export default {
  namespaced: true,

  state: () => ({
    activeMap: null, // activeMap details that we read from the configuration
    activeMapLocation: null,
    featuresCollection: [],//TODO remove it?. It is not used I think
    legend: [],
    differenceMap: false,
    availableTimeStamp: createAvailableTimestamp(), // TODO make use of it 
    timeOption: true,
    clickedPointBbox: [],
    timeSeriesForDownload: [],
    
  }),

  getters: {
    //filters the features collection of the activeMap
    filteredMap(state, getters, rootState, rootGetters) {
      const waterBodies = rootGetters['filters/availableWaterBodies']
      const { selectedBodyOfWater, selectedType } = rootState.filters

      if (state.activeMap?.data && state?.legend.length) {
        const featuresCollection = filterFeaturesCollection(
          state.activeMap.data,
          waterBodies,
          selectedBodyOfWater,
        )
        const data = { data: featuresCollection }
        
        const circlesColor = selectedType === 'concentration' || selectedType === 'trends'
          ? buildCirclesColorsRangeValues(state.legend)
          : buildCirclesColor(state.legend)
        
       
        //TODO: remove if it is working as expected
        const paint = !state.differenceMap ? { paint: buildPaintObject(circlesColor) } : null

        return { ...state.activeMap, ...data, ...paint }
      }
    },
    layerBbox(state, getters) {
      const { filteredMap } = getters
      
      if (!filteredMap) {
        return []
      }

      const { data } = filteredMap
      return getGeojsonBoundingBox(data)

    },

    //Mapbox layer from filteredMap
    activeMapLayer(state, getters) {
      if (state.differenceMap) {
        return null
      }
      const { filteredMap } = getters
      if (!filteredMap) {
        return null
      }
      return buildGeojonLayer(filteredMap)
    },
    activeDiffMapLayers(state, getters) {
     
      const { filteredMap } = getters
   
      if (!state.differenceMap ) {
        return []
      }
     
      if (!filteredMap) {
        return []
      }
      //NOTE: left reprsents old value, right new value
      const leftSemiCircleLayer = buildGeojsonLayerDiffMap(filteredMap, 'left', state.legend)
      const rightSemiCircleLayer = buildGeojsonLayerDiffMap(filteredMap, 'right', state.legend)
      const outerCircleLayer = buildGeojsonLayerDiffMapsOuterCircle(filteredMap)
      return [ outerCircleLayer, leftSemiCircleLayer, rightSemiCircleLayer ]
      

    },
    availableBaseMap() { 
      if (WaterbeheerderContours) {
        return buildBaseMapLayer(WaterbeheerderContours)
      }
    },
    activeService(state, getters, rootState) {
      const { selectedParticle, selectedType } = rootState.filters
       
      const { activeMap } = state
      if (!activeMap) {
        return
      }
      const { id } = activeMap
      const service = services.find(service => service.id === selectedType)
      const particle = service.spatialPlots.find(plot => plot.id === selectedParticle)

      return particle.services.find(service => service.id === id)
    },
    availableCharts(state, getters) { 
      const { activeService } = getters
      if (!activeService) {
        return 
      }
      const { charts } = activeService
      if(!Object.keys(charts).length) {
        return
      }
      return charts
    },
    availableDownloadUrl(state, getters) { 
      const { activeService } = getters
      if (!activeService) {
        return 
      }
      
      if(!activeService.hasOwnProperty('downloadUrl')) {
        return
      }
      const { downloadUrl } = activeService

      return downloadUrl
    },
    csvRows(state, getters, rootState, rootGetters){
      const { availableDownloadUrl }= getters
      if (!availableDownloadUrl) {
        return []
      }
      const { timeSeriesForDownload } = state
      
      const { selectedType, selectedParticle } = rootState.filters
      
      const locationsWithRelations = rootGetters['locations/locationsAndRelations']
      console.log('timeSeriesForDownload state', timeSeriesForDownload)
      console.log('selectedType', selectedType)
      console.log('locationsWithRelations', locationsWithRelations)
      return  mapCsvFormatToTimeseries(timeSeriesForDownload, locationsWithRelations, selectedParticle, selectedType)
    },
  },

  actions: {
    getTimeSeries({ commit, state, rootState }) {
      
      const { id } = state.activeMap
      const { selectedTimestamp, selectedType } = rootState.filters
      const params = {
        filterId: id,
        startTime: selectedTimestamp,
        endTime: selectedTimestamp,
        documentFormat: 'PI_JSON',
      }
      return $axios
        .get(`/FewsWebServices/rest/fewspiservice/${ VUE_APP_API_VERSION }/timeseries`, { params })
        .then(response => response?.data)
        .then(selectedType === 'concentration' ? mapTimeseriesToGeoJSONFloatValues : mapTimeseriesToGeoJSON)
        .then((timeSeries) => {
          commit('ADD_DATA_TO_ACTIVE_MAP', timeSeries)
        })
    },
    
    getTimeSeriesWithStandardTime({ commit, state, rootState }) {

      const { url } = state.activeMap
      const { selectedType } = rootState.filters
      return $axios
        .get(url)
        .then((response) => response?.data)
         .then(selectedType === 'trends' || selectedType ==='concentration' ? mapTimeseriesToGeoJSONFloatValues : mapTimeseriesToGeoJSON)
        .then((timeSeries) => {
          commit('ADD_DATA_TO_ACTIVE_MAP', timeSeries)
        })
    },
    getTimeSeriesForDownload({ commit, state, getters }) {
      const { availableDownloadUrl } = getters
      
      
      return $axios
        .get(availableDownloadUrl)
        .then((response) => response?.data)
        .then((timeSeries) => commit('SET_TIME_SERIES_FOR_DOWNLOAD', timeSeries))

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
        .then(({ legend }) => {
          commit('SET_LEGEND_GRAPHIC', { legend })
        })
    },
    resetActiveMap(context) {
      context.commit('RESET_ACTIVE_MAP')
    },
    resetActiveMapLocation(context) {
      context.commit('RESET_ACTIVE_MAP_LOCATION')
    },
    resetLegend(context) {
      context.commit('RESET_LEGEND')
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
    setTimeOption(context, payload) {
      context.commit('SET_TIME_OPTION', payload)
    },
    setClickedPointBbox(context, payload) {
      context.commit('SET_CLICKED_POINT_BBOX', payload)
    },
    resetClickedPointBbox(context) {
      context.commit('SET_CLICKED_POINT_BBOX', [])
    },
  },

  mutations: {
    ADD_DATA_TO_ACTIVE_MAP(state, features) {
      const data = { data: features }
      state.activeMap = { ...state.activeMap, ...data }
    },
    RESET_ACTIVE_MAP(state) {
      state.activeMap = null
    },
    RESET_ACTIVE_MAP_LOCATION(state) {
      state.activeMapLocation = null
    },
    RESET_LEGEND(state) {
      state.legend = []
    },
    SET_ACTIVE_MAP(state, { activeMap }) {
      state.activeMap = activeMap
    },
    SET_ACTIVE_MAP_LOCATION(state, activeMapLocation ) {
      state.activeMapLocation = activeMapLocation
    },
    SET_LEGEND_GRAPHIC(state, { legend }) {
      state.legend = legend
    },
    SET_DIFFERENCE_MAP(state, boolean) {
      state.differenceMap = boolean
    },
    SET_TIME_OPTION(state, boolean) {
      state.timeOption = boolean
    },
    SET_CLICKED_POINT_BBOX(state, array) {
      state.clickedPointBbox = [ ...array, ...array ]
    },
    SET_TIME_SERIES_FOR_DOWNLOAD(state, timeSeries) {
      console.log('timeSeries', timeSeries)
      state.timeSeriesForDownload = timeSeries
    },
  },
}
