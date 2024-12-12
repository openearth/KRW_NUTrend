import getBasinsFromLocations from '~/lib/get-basins-from-locations'
import getSubBasinsFromLocations from '~/lib/get-sub-basins-from-locations'
import getWaterBodiesFromLocations from '~/lib/get-water-bodies-from-locations'
import getWaterManagersFromLocations from '~/lib/get-water-managers-from-locations'

export default {
  namespaced: true,

  state: () => ({
    selectedBasin: null,
    selectedBodyOfWater: null,
    selectedParticle: null,
    selectedSubBasin: null,
    selectedType: null,
    selectedWaterManager: null,
    selectedTimestamp: '2022-01-01T00:00:00Z', 
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
      const { selectedBasin, selectedSubBasin, selectedWaterManager, selectedType } = state
      return getWaterBodiesFromLocations(locations, selectedBasin, selectedSubBasin, selectedWaterManager, selectedType)
    },
    availableWaterManagers(state, getters, rootState) {
      const { locations } = rootState.locations
      const { selectedBasin, selectedSubBasin } = state
      return getWaterManagersFromLocations(locations, selectedBasin, selectedSubBasin)
    },
    uniqueId(state) {
      const { selectedBasin, selectedSubBasin, selectedWaterManager, selectedBodyOfWater } = state
      if (!selectedBasin && !selectedSubBasin && !selectedWaterManager && !selectedBodyOfWater) {
        return null
      }

      return `${ selectedBasin }-${ selectedSubBasin }-${ selectedWaterManager }-${ selectedBodyOfWater }`
    },
  },

  actions: {
    setSelectedBasin(context, payload) {
      context.commit('SET_SELECTED_BASIN', payload)
    },
    resetSelectedBasin(context) {
      context.commit('SET_SELECTED_BASIN', null)
    },
    setSelectedBodyOfWater(context, payload) {
      context.commit('SET_SELECTED_BODY_OF_WATER', payload)
    },
    resetSelectedBodyOfWater(context) {
      context.commit('SET_SELECTED_BODY_OF_WATER', null)
    },
    setSelectedParticle(context, payload) {
      context.commit('SET_SELECTED_PARTICLE', payload)
    },
    setSelectedSubBasin(context, payload) {
      context.commit('SET_SELECTED_SUB_BASIN', payload)
    },
    resetSelectedSubBasin(context) {
      context.commit('SET_SELECTED_SUB_BASIN', null)
    },
    setSelectedTimestamp(context, payload) {
      context.commit('SET_SELECTED_TIMESTAMP', payload)
    },
    setSelectedType(context, payload) {
      context.commit('SET_SELECTED_TYPE', payload)
    },
    setSelectedWaterManager(context, payload) {
      context.commit('SET_SELECTED_WATER_MANAGER', payload)
    },
    resetSelectedWaterManager(context) {
      context.commit('SET_SELECTED_WATER_MANAGER', null)
    },
  },

  mutations: {
    SET_SELECTED_BASIN(state, { selectedBasin }) {
      state.selectedBasin = selectedBasin
    },
    SET_SELECTED_BODY_OF_WATER(state, { selectedBodyOfWater }) {
      state.selectedBodyOfWater = selectedBodyOfWater
    },
    SET_SELECTED_PARTICLE(state, { selectedParticle }) {
      state.selectedParticle = selectedParticle
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
    SET_SELECTED_TIMESTAMP(state, { selectedTimestamp }) {
      state.selectedTimestamp = selectedTimestamp
    },
  },
}
