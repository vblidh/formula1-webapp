export default {
    naespaced: true,
    state: {
        Circuits: [],
        ChosenCircuitId: 0,
        RaceList: [],

    },
    getters: {
        chosenCircuitId: state => {
            return state.ChosenCircuitId;
        },
        RaceList: state => state.RaceList,
        Circuits: state => state.Circuits,
    },
    mutations: {
        updateCircuitId(state, payload) {
            state.ChosenCircuitId = payload;
        },
        updateRaceList(state, payload) {
            state.RaceList = payload;
        },
        updateCircuits(state, payload) {
            state.Circuits = payload;
        },
    },
    actions: {
        async getCircuits({ state, commit, dispatch }) {
            var url = '/circuits';
            var data = await dispatch('getDataFromAPI', { url }, { root: true });
            commit('updateRaceList', data.circuits);
        }
    }
};