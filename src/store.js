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
      localStorage.setItem('cart', state.cart.toString());
    },
    removeFromCart(state, payload) {
      state.cart.splice(state.cart.indexOf(payload.id), 1)
      localStorage.setItem('cart', state.cart.toString());
    },
    checkExistingStorage(state) {
      let existing = localStorage.getItem('cart')
      existing = existing ? existing.split(',').map(Number) : []
      state.cart = existing
    }
  },
  actions: {

  }
})
