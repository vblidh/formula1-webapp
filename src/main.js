import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import VueCookies from 'vue-cookies';
import axios from 'axios';
import VueAxios from 'vue-axios';
import store from './store'

Vue.config.productionTip = false

axios.defaults.baseURL = "https://ergast.com/api/f1/";
Vue.use(VueCookies);
Vue.use(VueAxios, axios);

Vue.$cookies.config('30d');
 
new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
