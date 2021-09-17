import Vue from 'vue'
import Vuex from 'vuex'

import filters from './modules/filters'
import locations from './modules/locations'
import layers from './modules/layers'
import modal from './modules/modal'

Vue.use(Vuex)

export default new Vuex.Store({
  actions: {},
  modules: {
    filters,
    locations,
    layers,
    modal,
  },
})
