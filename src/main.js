import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import VueCookies from 'vue-cookies';
import axios from 'axios';
import VueAxios from 'vue-axios';
import store from './store'

Vue.config.productionTip = false

axios.defaults.baseURL = "https://127.0.0.1:5001/api";
Vue.use(VueCookies);
Vue.use(VueAxios, axios);

Vue.$cookies.config('30d');
// var _lsTotal=0,_xLen,_x;for(_x in localStorage){ if(!localStorage.hasOwnProperty(_x)){continue;} _xLen= ((localStorage[_x].length + _x.length)* 2);_lsTotal+=_xLen; console.log(_x.substr(0,50)+" = "+ (_xLen/1024).toFixed(2)+" KB")};console.log("Total = " + (_lsTotal / 1024).toFixed(2) + " KB");
new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
