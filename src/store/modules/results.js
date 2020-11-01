export default {
    namespaced: true,
    state: {
        resultsData: [],
        raceHeaders: [
            {
                text: "Position",
                value: "Position",
                divider: true,
                align: "center",
                width: "4",
            },
            { text: "Name", value: "Name", divider: true, align: "center" },
            { text: "Team", value: "Team", divider: true, align: "center" },
            { text: "Time", value: "Time", divider: true, align: "center" },
            { text: "Points", value: "Points", divider: true, align: "center" },
        ],
        qualifyingHeaders: [
            {
                text: "Position",
                value: "Position",
                divider: true,
                align: "center",
                width: "4",
            },
            { text: "Name", value: "Name", divider: true, align: "center" },
            { text: "Team", value: "Team", divider: true, align: "center" },
            { text: "Q1", value: "Q1", divider: true, align: "center" },
            { text: "Q2", value: "Q2", divider: true, align: "center" },
            { text: "Q3", value: "Q3", divider: true, align: "center" },
        ],
        currentRace: {

        },
        currentYear: 2020,
        currentRound: 1,
        currentMode: 'race',
    },
    getters: {
        resultsData: state => {
            return state.resultsData;
        },
        currentHeader: state => {
            if (state.currentMode == 'race') {
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
        currentMode: state => state.currentMode,
        currentRace: state => state.currentRace,
    },
    mutations: {
        updateRound(state, payload) {
            state.currentRound = payload;
        },
        updateYear(state, payload) {
            state.currentYear = payload;
        },
        updateMode(state, payload) {
            state.currentMode = payload;
        },
        updateResultsData(state, payload) {
            state.resultsData = payload
        },
        updateCurrentRace(state, payload) {
            state.currentRace = payload;
        }
    },
    actions: {
        async getNewResults({ state, commit, dispatch }, payload) {
            var mode = state.currentMode;
            if (!Object.is(payload, undefined)) {
                if (!Object.is(payload.mode, undefined)) {
                    mode = payload.mode;
                }
                if (!(Object.is(payload.year, undefined) || isNaN(Number(payload.year)))) {
                    commit('updateYear', payload.year);
                }
                if (!(Object.is(payload.round, undefined) || isNaN(Number(payload.round)))) {
                    commit('updateRound', payload.round);
                }
            }
            // TODO: Check cache

            var { exists, data } = await dispatch('tryGetCachedData', { mode });

            if (!exists) {
                var url = '/results/' + mode + '?year=' + state.currentYear + '&round=' + state.currentRound;
                data = await dispatch('getDataFromAPI', { url }, { root: true });
                dispatch('addDataToCache', {data, mode});
            }

            var results, driver, name, constructor, pos, obj, i;
            var tmp = [];
            if (mode === 'race') {
                results = data.race_results.results[0];
                commit('updateRace', data.race_results.race);
                for (i = 0; i < results.length; i++) {
                    driver = results[i].driver;
                    name = driver.first_name + " " + driver.last_name;
                    pos = results[i].position_order;
                    constructor = results[i].team.name;
                    var time;
                    var status = results[i].status;
                    if (status === "Finished") {
                        time = results[i].time;
                    } else if (status.startsWith("+")) {
                        time = status;
                    } else {
                        time = "DNF (" + status + ")";
                    }
                    var points = results[i].points;
                    obj = {
                        Position: pos,
                        Name: name,
                        Team: constructor,
                        Time: time,
                        Points: points,
                    };
                    tmp.push(obj);
                }
            }
            else {
                results = data.qualifying_results.results[0];
                commit('updateRace', data.qualifying_results.race);
                for (i = 0; i < results.length; i++) {
                    driver = results[i].driver;
                    name = driver.first_name + " " + driver.last_name;
                    pos = results[i].position;
                    constructor = results[i].team.name;
                    var q2;
                    var q3;
                    var q1 = results[i].Q1;
                    if (q1 == null) {
                        q1 = q2 = q3 = "Did not qualify";
                    } else {
                        q2 = results[i].Q2;
                        if (q2 == null) {
                            q2 = q3 = "-";
                        } else {
                            q3 = results[i].Q3;
                        }
                    }
                    obj = {
                        Position: pos,
                        Name: name,
                        Team: constructor,
                        Q1: q1,
                        Q2: q2,
                        Q3: q3,
                    };
                    tmp.push(obj);
                }
            }
            commit('updateMode', mode);
            commit('updateResultsData', tmp);

        },
        tryGetCachedData({ state }, payload) {
            var mode;
            if (!Object.is(payload, undefined)) {
                mode = payload.mode;
            }
            else {
                mode = state.currentMode;
            }
            var key1 = mode === 'race' ? 'RaceResults' : 'QualifyingResults';

            var cache = localStorage.getItem(key1);
            if (cache !== null) {
                cache = JSON.parse(cache);
                var key2 = String(state.currentYear) + "_" + String(state.currentRound);
                if (!Object.is(cache[key2], undefined)) {
                    return { exists: true, data: cache[key2] };
                }
            }

            return { exists: false, data: {} };
        },
        addDataToCache({ state }, payload) {
            var key1;
            var mode = payload.mode;
            var data = payload.data;
            if (Object.is(mode, undefined)) mode = state.currentMode;
            key1 = mode === 'race' ? 'RaceResults' : 'QualifyingResults';
            var cache = localStorage.getItem(key1);
            if (cache === null) {
                localStorage.setItem(key1, JSON.stringify({}));
                cache = localStorage.getItem(key1);
            }
            var parsedCache = JSON.parse(cache);
            var key2 = String(state.currentYear) + "_" + String(state.currentRound);

            parsedCache[key2] = data;
            localStorage.setItem(key1, JSON.stringify(parsedCache));
        }
    }
};