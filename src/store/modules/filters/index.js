import getBasinsFromLocations from '~/lib/get-basins-from-locations'
import getSubBasinsFromLocations from '~/lib/get-sub-basins-from-locations'
import getWaterBodiesFromLocations from '~/lib/get-water-bodies-from-locations'
import getWaterManagersFromLocations from '~/lib/get-water-managers-from-locations'

export default {
  namespaced: true,

  state: () => ({
    selectedBasin: null,
    selectedBodyOfWater: null,
    selectedPartical: null,
    selectedSubBasin: null,
    selectedType: null,
    selectedWaterManager: null,
  }),

  getters: {
    availableBasins(state, getters, rootState) {
      const { locations } = rootState.locations

      return getBasinsFromLocations(locations)
    },
    availableSubBasins(state, getters, rootState) {
      const { locations } = rootState.locations

      return getSubBasinsFromLocations(locations)
    },
    availableWaterBodies(state, getters, rootState) {
      const { locations } = rootState.locations
      const { selectedBasin, selectedSubBasin, selectedWaterManager } = state

      return getWaterBodiesFromLocations(locations, selectedBasin, selectedSubBasin, selectedWaterManager)
    },
    availableWaterManagers(state, getters, rootState) {
      const { locations } = rootState.locations
      const { selectedBasin, selectedSubBasin } = state

      return getWaterManagersFromLocations(locations, selectedBasin, selectedSubBasin)
    },
  },

  actions: {
    setSelectedBasin(context, payload) {
      context.commit('SET_SELECTED_BASIN', payload)
    },
    setSelectedBodyOfWater(context, payload) {
      context.commit('SET_SELECTED_BODY_OF_WATER', payload)
    },
    setSelectedPartical(context, payload) {
      context.commit('SET_SELECTED_PARTICAL', payload)
    },
    setSelectedSubBasin(context, payload) {
      context.commit('SET_SELECTED_SUB_BASIN', payload)
    },
    setSelectedType(context, payload) {
      context.commit('SET_SELECTED_TYPE', payload)
    },
    setSelectedWaterManager(context, payload) {
      context.commit('SET_SELECTED_WATER_MANAGER', payload)
    },
  },

  mutations: {
    SET_SELECTED_BASIN(state, { selectedBasin }) {
      state.selectedBasin = selectedBasin
    },
    SET_SELECTED_BODY_OF_WATER(state, { selectedBodyOfWater }) {
      state.selectedBodyOfWater = selectedBodyOfWater
    },
    SET_SELECTED_PARTICAL(state, { selectedPartical }) {
      state.selectedPartical = selectedPartical
    },
    SET_SELECTED_SUB_BASIN(state, { selectedSubBasin }) {
      state.selectedSubBasin = selectedSubBasin
    },
    SET_SELECTED_TYPE(state, { selectedType }) {
      state.selectedType = selectedType
    },
    SET_SELECTED_WATER_MANAGER(state, { selectedWaterManager }) {
      state.selectedWaterManager = selectedWaterManager
    },
  },
}
