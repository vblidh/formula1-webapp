export default {
    namespaced: true,
    state: {
        Circuits: [],
        ChosenCircuit: {},
        RaceList: [],
        RaceTableHeaders: [
            {
                text: "Year",
                value: 'year',
                divider: true,
                align: 'center'
            },
            {
                text: "Driver",
                value: "driver",
                divider: true,
                align: "center",
            },
            {
                text: "Team",
                value: 'team',
                divider: true,
                align: 'center'
            },
            {
                text: 'Fastest Lap',
                value: 'fastestLap',
                divider: true,
                align: 'center'
            }
        ],
        TotalRacesInCircuit: 0,
        CurrentPage: 1,
        PageSize: 5,
        RequestPending: false,


    },
    getters: {
        ChosenCircuit: state => state.ChosenCircuit,
        Headers: state => state.RaceTableHeaders,
        ChosenCircuitLink: state => state.ChosenCircuit.wiki_url,
        RaceList: state => state.RaceList,
        TotalRaces: state => state.TotalRacesInCircuit,
        Circuits: state => state.Circuits,
        Page: state => state.CurrentPage,
        PageSize: state => state.PageSize,
        IsRequestPending: state => state.RequestPending,
    },
    mutations: {
        updateChosenCircuit(state, payload) {
            state.ChosenCircuit = payload;
        },
        updateRaceList(state, payload) {
            state.RaceList = payload;
        },
        updateCircuits(state, payload) {
            state.Circuits = payload;
        },
        updateTotalRaces(state, payload) {
            state.TotalRacesInCircuit = payload;
        },
        updatePage(state, payload) {
            state.CurrentPage = payload;
        },
        updatePageSize(state, payload) {
            state.PageSize = payload;
        },
        setRequestPending(state, payload) {
            state.RequestPending = payload;
        }
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
                if (!Object.is(payload.circuit, undefined)) {
                    commit('updateChosenCircuit', payload.circuit)
                }
            }
            commit('updateRaceList', []);
            commit('setRequestPending', true);
            var url = '/circuits/' + state.ChosenCircuit.id + '/results?page='
                + state.CurrentPage + '&page_size=' + state.PageSize;
            var resp = await dispatch('getDataFromAPI', { url }, { root: true });
            var data = resp.data;
            var years = Object.keys(data);
            var circuitResults = [];
            years.map(year => {
                var winner = data[year].results[0];
                circuitResults.push({
                    raceId: data[year].race_id,
                    year: year,
                    driver: (winner.driver.first_name + " " + winner.driver.last_name),
                    team: winner.team.name,
                    fastestLap: winner.fastest_lap_time === "\\N" ? "Not recorded" : winner.fastest_lap_time,
                });
            });
            circuitResults.sort((a, b) => b.year - a.year);
            commit('updateRaceList', circuitResults);
            commit('updateTotalRaces', resp.total_entries);
            commit('setRequestPending', false);

        },
    }
};