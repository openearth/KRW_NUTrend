import Vue from 'vue'
import Vuex from 'vuex'

import map from './modules/map'

Vue.use(Vuex)

export default new Vuex.Store({
  state: { testData: null },
  mutations: {
    SET_TEST_DATA(state, data) {
      state.testData = data
    },
  },
  actions: {},
  modules: {
    map,
  },
})
