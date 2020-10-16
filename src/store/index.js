import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
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
  }
})
