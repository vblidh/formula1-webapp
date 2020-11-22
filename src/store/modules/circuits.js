export default {
    namespaced: true,
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
            if (state.Circuits.length > 0) return;
            var url = '/circuits';
            var data = await dispatch('getDataFromAPI', { url }, { root: true });
            commit('updateCircuits', data.circuits);
        },
        async getCircuitRaces({ state, commit, dispatch }, payload) {
            if (!Object.is(payload, undefined)) {
                if (!(Object.is(payload.id, undefined) || isNaN(Number(payload.id)))) {
                    commit('updateCircuitId', payload.id)
                }
            }
            var url = '/circuits/' + state.chosenCircuitId + '/results';
            var resp = await dispatch('getDataFromAPI', { url }, { root: true });
            var data = resp.data;
            var keys = Object.keys(data);
            console.log(keys);
            // for (let i = 0; i < keys.length; i++) {
            // }
        },
    }
};