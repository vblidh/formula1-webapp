export default {
    namespaced: true,
    state: {
        resultsData: [],
        raceHeaders: [],
        qualifyingHeaders: [],
        currentYear: 2020,
        currentRound: 1,
        currentMode: 'race',
    },
    getters: {
        resultsData: state => {
            return state.resultsData;
        },
        currentHeader: state => {
            if (state.currentMode == 'race'){
                return state.raceHeaders;
            }
            else {
                return state.qualifyingHeaders;
            }
        },
        currentYear: state => {
            return state.currentYear;
        },
        currentRound: state => state.currentRound,
        currentMode : state => state.currentMode,
        
    },
    mutations: {
        updateValue(state, payload) {
            state.value = payload;
        }
    },
    actions: {
        updateValue({commit}, payload) {
            commit('updateValue', payload);
        }
    }
};