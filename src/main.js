import Vue from 'vue'
import './cube-ui'
import './register'   //createApi
import App from './App.vue'
import './registerServiceWorker'

import 'common/stylus/index.styl'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
