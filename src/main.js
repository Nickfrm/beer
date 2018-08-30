import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import customButton from '@/components/button'

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

Vue.component('custom-button', customButton.default || customButton)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
