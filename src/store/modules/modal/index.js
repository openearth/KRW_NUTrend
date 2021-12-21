export default {
  namespaced: true,

  state: () => ({
    isOpen: false,
    title: '',
    toestandChartType: null, 
  }),

  getters: {},

  actions: {
    setIsOpen(context, payload) {
      context.commit('SET_IS_OPEN', payload)
    },
    setModalTitle(context, payload) {
      context.commit('SET_MODAL_TITLE', payload)
    },
    setToestandChartType(context, payload){
      context.commit('SET_TOESTAND_CHART_TYPE', payload)
    },
    resetToestandChartType({ commit }) {
      commit('RESET_TOESTAND_CHART_TYPE')
    },
  },

  mutations: {
    SET_IS_OPEN(state, { isOpen }) {
      state.isOpen = isOpen
    },
    SET_MODAL_TITLE(state, { title }) {
      state.title = title
    },
    SET_TOESTAND_CHART_TYPE(state, { type }) {
      state.toestandChartType = type
    },
    RESET_TOESTAND_CHART_TYPE(state) {
      state.toestandChartType = null
    },
  },
}
