import Vue from 'vue'
import Vuex from 'vuex'

import filters from './modules/filters'
import locations from './modules/locations'
import map from './modules/map'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    filters,
    locations,
    map,
  },
})
