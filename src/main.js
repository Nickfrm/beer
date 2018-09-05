import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import customButton from '@/components/button'
import customLink from '@/components/link'
import loadingOverlay from '@/components/loading-overlay'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner, faShoppingCart } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSpinner, faShoppingCart)

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

Vue.component('custom-button', customButton.default || customButton)
Vue.component('custom-link', customLink.default || customLink)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('loading-overlay', loadingOverlay)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
