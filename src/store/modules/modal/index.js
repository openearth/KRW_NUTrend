export default {
  namespaced: true,

  state: () => ({
    isOpen: false,
    title: '',
  }),

  getters: {},

  actions: {
    setIsOpen(context, payload) {
      context.commit('SET_IS_OPEN', payload)
    },
    setModalTitle(context, payload) {
      context.commit('SET_MODAL_TITLE', payload)
    },
  },

  mutations: {
    SET_IS_OPEN(state, { isOpen }) {
      state.isOpen = isOpen
    },
    SET_MODAL_TITLE(state, { title }) {
      state.title = title
    },
  },
}
