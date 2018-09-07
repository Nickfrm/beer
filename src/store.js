import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cart: []
  },
  mutations: {
    addToCart(state, payload) {
      state.cart.push(payload.id)
    },
    removeFromCart(state, payload) {
      state.cart.splice(state.cart.indexOf(payload.id), 1)
    }
  },
  actions: {

  }
})
