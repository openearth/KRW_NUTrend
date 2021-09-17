import $axios from '~/plugins/axios'
import mapTimeseriesToGeojson from '~/lib/map-timeseries-to-geojson'
import filterFeaturesCollection from "~/lib/filter-features-collection"

const { VUE_APP_API_VERSION } = process.env

export default {
  namespaced: true,

  state: () => ({
    featuresCollection: [],
    selectedLayer: {
      id: "krw-wl-ntot-toets-lSGBP",
      paint: {
        "circle-radius": 6,
        "circle-stroke-color": "#000000",
        "circle-stroke-opacity": 1,
        "circle-color": [
          "match",
          [ "get", "value" ],
          "4",
          "#a0ee45",
          "3",
          "#ffff00",
          "2",
          "#EE9900",
          "1",
          "#E51B23",
          "#ccc",
        ],
      },
    },
    selectedTime: "2020-01-01T00:00:00Z",
  }),
  getters: {
    availableLayer(state, getters, rootState, rootGetters) {
      const waterBodies = rootGetters['filters/availableWaterBodies']
      const layer = state.selectedLayer
      if (layer.data) {
        const featuresCollection = filterFeaturesCollection(
          layer.data,
          waterBodies,
        )
        const data = { data: featuresCollection }
        return { ...layer, ...data }

      } 
      
    },
  },
  actions: {
    getInitialMapData({ commit, state }) {
      const params = {
        filterId: state.selectedLayer.id,
        startTime: state.selectedTime,
        endTime: state.selectedTime,
        documentFormat: "PI_JSON",
      }
      return $axios
        .get(
          `/FewsWebServices/rest/fewspiservice/${ VUE_APP_API_VERSION }/timeseries`,
          { params },
        )
        .then((response) => response?.data?.timeSeries)
        .then(mapTimeseriesToGeojson)
        .then((timeSeries) => {
          commit("SET_FEATURESCOLLECTION", timeSeries) 
          commit("ADD_FEATURES_TO_LAYER", timeSeries)
        })
    },
  },

  mutations: {
    SET_FEATURESCOLLECTION(state, data) { //TODO check if needed this one.
      state.timeseries = data
    },
    ADD_FEATURES_TO_LAYER(state, features) { 
      const data = { data: features }
      state.selectedLayer = { ...state.selectedLayer, ...data }
    },
  },
}
