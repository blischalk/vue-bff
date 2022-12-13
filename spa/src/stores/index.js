import { createStore } from 'vuex'
// Create a new store instance.
const store = createStore({
  state: {
    isAuthenticated: false
  },
  getters: {
    isAuthenticated(state) {
      return state.isAuthenticated;
    }
  },
  mutations: {
    login (state) {
      state.isAuthenticated = true;
    },

    logout (state) {
      state.isAuthenticated = false;
    }
  }
})

export default store