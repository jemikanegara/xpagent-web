import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import { store } from './vuex/store'
import filters from './filters'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserCircle, faHome, faUsers, faPlus, faCaretUp, faCaretDown, faBars, faEye, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserCircle, faHome, faUsers, faPlus, faCaretUp, faCaretDown, faBars, faEye, faTimes, faCheck)
Vue.component('font-awesome', FontAwesomeIcon)

Vue.config.productionTip = false
Vue.use(VueRouter)



// Instance
new Vue({
  router,
  store,
  filters,
  render: h => h(App),
}).$mount('#app')
