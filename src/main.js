import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import VueCookies from 'vue-cookies'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false

axios.default.baseURL = "https://ergast.com/api"
Vue.use(VueCookies)
Vue.use(VueAxios, axios)

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
