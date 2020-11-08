import Vue from 'vue'
import Vuex from 'vuex'
import Standings from './modules/standings';
import Results from './modules/results';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Seasons: Array(71).fill().map((_, i) => 2020-i),
  },
  getters: {
    Seasons: state => {
      return state.Seasons;
    },
  },
  mutations: {
  },
  actions: {
    getDataFromAPI(state, payload) {
      return new Promise((resolve, reject) => {
        Vue.axios.get(payload.url)
          .then((resp) => resp.data)
          .then(data => resolve(data))
          .catch((error) => reject(error));
      })
    }
  },
  modules: {
    Standings,
    Results,
  }
})
