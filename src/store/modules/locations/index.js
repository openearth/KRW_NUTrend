import $axios from '~/plugins/axios'

import filterEmptyLocations from '~/lib/filter-empty-locations'

const { VUE_APP_API_VERSION } = process.env

export default {
  namespaced: true,

  state: () => ({
    locations: [],
  }),

  actions: {
    getLocations(context) {
      const params = {
        showAttributes: 'true',
        documentFormat: 'PI_JSON',
      }

      return $axios.get(`/FewsWebServices/rest/fewspiservice/${ VUE_APP_API_VERSION }/locations`, { params })
        .then(response => response?.data?.locations)
        .then(filterEmptyLocations)
        .then(locations => context.commit('SET_LOCATIONS', { locations }))
    },
  },

  mutations: {
    SET_LOCATIONS(state, { locations }) {
      state.locations = locations
    },
  },
}
