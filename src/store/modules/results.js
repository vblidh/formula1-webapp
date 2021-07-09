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
            { text: "Grid position", value: "Grid", divider: true, align: "center" },
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
        currentRaceList: [],
        currentYear: 2020,
        currentRound: 1,
        currentMode: 'race',
        lapTimes: []
    },
    getters: {
        resultsData: state => state.resultsData,
        currentHeader: state => {
            if (state.currentMode == 'race') {
                return state.raceHeaders;
            }
            else {
                return state.qualifyingHeaders;
            }
        },
        currentYear: state => state.currentYear,
        currentRound: state => state.currentRound,
        currentMode: state => state.currentMode,
        currentRace: state => state.currentRace,
        currentRaceList: state => {
            return state.currentRaceList;
        },
        currentRaceName: state => {
            if (Object.is(state.currentRace.name, undefined)) return "";
            return state.currentRace.name;
        },
        currentRaceDate: state => {
            if (Object.is(state.currentRace.date, undefined)) return "";
            return state.currentRace.date;
        },
        currentRaceCircuit: state => {
            if (Object.is(state.currentRace.circuit, undefined)) return "";
            return state.currentRace.circuit;
        },
        lapTimes: state => state.lapTimes,
    },
    mutations: {
        updateRound(state, payload) {
            state.currentRound = payload;
        },
        updateYear(state, payload) {
            if (!isNaN(Number(payload)))
                state.currentYear = payload;
        },
        updateMode(state, payload) {
            state.currentMode = payload;
        },
        updateResultsData(state, payload) {
            state.resultsData = payload;
        },
        updateCurrentRace(state, payload) {
            state.currentRace = payload;
        },
        updateRaceList(state, payload) {
            state.currentRaceList = payload;
        },
        updateLapTimeList(state, payload) {
            state.lapTimes = payload;
        }
    },
    actions: {
        async getRacesInYear({ state, commit, dispatch }, payload) {
            if (!Object.is(payload, undefined)) {
                if (!(Object.is(payload.year, undefined) || isNaN(Number(payload.year)))) {
                    commit('updateYear', payload.year);
                }
            }
            var cachedRaces = localStorage.getItem('Races')
            var raceList;
            if (cachedRaces !== null) {
                var parsedRaces = JSON.parse(cachedRaces);
                raceList = parsedRaces[String(state.currentYear)];
                if (!Object.is(raceList, undefined)) {
                    console.log("Got races from cache", raceList);
                    commit('updateRaceList', raceList);
                    return;
                }
            }
            var url = '/races?year=' + state.currentYear;
            var data = await dispatch('getDataFromAPI', { url }, { root: true });
            var races = data.races;
            raceList = [];
            var obj;
            races.forEach(race => {
                obj = {
                    text: race.name,
                    value: race.round
                };
                raceList.push(obj);
            });
            commit('updateRaceList', raceList);
            if (cachedRaces === null) {
                var cacheToAdd = {};
                cacheToAdd[String(state.currentYear)] = raceList;
                localStorage.setItem('Races', JSON.stringify(cacheToAdd));
            }
            else {
                parsedRaces[String(state.currentYear)] = raceList;
                localStorage.setItem('Races', JSON.stringify(parsedRaces));
            }

        },
        async getNewResults({ state, commit, dispatch }, payload) {
            // console.log("Year:", state.currentYear);
            // console.log("Round: ", state.currentRound);
            // console.log("Mode:", state.currentMode);
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

            var { exists, data } = await dispatch('tryGetCachedData', { mode });
            if (!exists) {
                var url = '/results/' + mode + '?year=' + state.currentYear + '&round=' + state.currentRound;
                data = await dispatch('getDataFromAPI', { url }, { root: true });
                dispatch('addDataToCache', { data, mode });
            }
            var results = data.data[0].results;
            commit('updateCurrentRace', data.data[0].race);
            if (mode === 'race') {
                dispatch('compileResultData', results);
            }
            else {
                dispatch('compileQualiData', results);
            }
            commit('updateMode', mode);

        },
        async getRaceResultsById({ commit, dispatch }, id) {
            commit('updateMode', 'race');
            var url = '/results/race/' + id
            var resp = await dispatch('getDataFromAPI', { url }, { root: true });
            var race = resp.data.race;
            var results = resp.data.results
            commit('updateYear', Number(race.year));
            commit('updateRound', Number(race.round));
            commit('updateCurrentRace', race);
            dispatch('compileResultData', results);
        },
        compileQualiData({ commit }, results) {
            var tmp = [];
            var i, driver, name, pos, constructor, q1, q2, q3, obj;
            for (i = 0; i < results.length; i++) {
                driver = results[i].driver;
                name = driver.first_name + " " + driver.last_name;
                pos = results[i].position;
                constructor = results[i].team.name;
                q2;
                q3;
                q1 = results[i].Q1;
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
            commit('updateResultsData', tmp);
        },
        compileResultData({ commit }, results) {
            console.log("Results:", results);
            var tmp = [];
            var name, pos, driver, constructor, time, status, grid, points, obj;
            for (var i = 0; i < results.length; i++) {
                driver = results[i].driver;
                name = driver.first_name + " " + driver.last_name;
                pos = results[i].position_order;
                constructor = results[i].team.name;
                status = results[i].status;
                grid = results[i].grid;

                if (status === "Finished") {
                    time = results[i].time;
                } else if (status.startsWith("+")) {
                    time = status;
                } else {
                    time = "DNF (" + status + ")";
                }
                points = results[i].points;
                obj = {
                    Position: pos,
                    Name: name,
                    Team: constructor,
                    Time: time,
                    Points: points,
                    Grid: grid,
                };
                tmp.push(obj);
            }
            commit('updateResultsData', tmp);
        },
        async getLaptimes({ state, commit, dispatch }) {
            var url = '/laptimes/' + state.currentRace.raceId;

            var resp = await dispatch('getDataFromAPI', { url }, { root: true });
            
            console.log(resp.data);
            commit('updateLapTimeList', resp.data);
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
}