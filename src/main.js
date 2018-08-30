import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import customButton from '@/components/button'
import customLink from '@/components/link'

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

Vue.component('custom-button', customButton.default || customButton)
Vue.component('custom-link', customLink.default || customLink)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
