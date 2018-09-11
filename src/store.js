import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart))
}

function receiveCart() {
  let existing = localStorage.getItem('cart')
  return existing ? JSON.parse(existing) : []
}

export default new Vuex.Store({
  state: {
    cart: [],
    loading: 0
  },
  mutations: {
    loadingOn(state) {
      state.loading = 1
    },
    loadingOff(state) {
      state.loading = 0
    },
    addToCart(state, payload) {
      state.cart.push(payload.id)
      saveCart(state.cart)
    },
    removeFromCart(state, payload) {
      state.cart.splice(state.cart.indexOf(payload.id), 1)
      saveCart(state.cart)
    },
    fillCart(state) {
      state.cart = receiveCart()
    }
  },
  actions: {

  }
})
