import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import customButton from '@/components/button'
import customSelect from '@/components/custom-select'
import customLink from '@/components/link'
import loadingOverlay from '@/components/loading-overlay'
import inlineLoading from '@/components/inline-loading'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner, faShoppingCart, faMoneyBillAlt, faCreditCard, faCartArrowDown, faBars, faSearch, faCaretDown, faTimes, faCartPlus, faBeer, faTrash, faCheck, faArrowAltCircleDown } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSpinner, faShoppingCart, faMoneyBillAlt, faCreditCard, faCartArrowDown, faBars, faSearch, faCaretDown, faTimes, faCartPlus, faBeer, faTrash, faCheck, faArrowAltCircleDown)

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

Vue.component('custom-button', customButton.default || customButton)
Vue.component('custom-select', customSelect.default || customSelect)
Vue.component('custom-link', customLink.default || customLink)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('loading-overlay', loadingOverlay)
Vue.component('inline-loading', inlineLoading)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
