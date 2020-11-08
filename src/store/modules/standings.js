export default {
    namespaced: true,
    state: {
        currentStandingsData: [],
        driverStandingsHeader: [
            {
                text: "Position",
                value: "Position",
                divider: true,
                align: "center",
                width: "4",
            },
            { text: "Name", value: "Name", divider: true, align: "center" },
            {
                text: "Number",
                value: "Number",
                divider: true,
                align: "center",
                width: "4",
            },
            {
                text: "Nationality",
                value: "Nationality",
                divider: true,
                align: "center",
            },
            { text: "Points", value: "Points", divider: true, align: "center" },
            { text: "Wins (season)", value: "Wins", divider: true, align: "center", width: "5" },
        ],
        teamStandingsHeader: [
            {
                text: "Position",
                value: "Position",
                divider: true,
                align: "center",
                width: "4",
            },
            { text: "Name", value: "Name", divider: true, align: "center" },
            { text: "Country", value: "Country", divider: true, align: "center" },
            { text: "Points", value: "Points", divider: true, align: "center" },
            { text: "Wins (season)", value: "Wins", divider: true, align: "center", width: "5" },
        ],
        currentYear: 2020,
        currentMode: "drivers",
        currentRound: 1,
        totalSeasonRound: 0,
        currentDate: "",

    },
    getters: {
        currentStandingsData: state => {
            return state.currentStandingsData;
        },
        currentStandingsHeader: state => {
            if (state.currentMode == "drivers") {
                return state.driverStandingsHeader;
            }
            else {
                return state.teamStandingsHeader;
            }
        },
        currentYear: state => {
            return state.currentYear;
        },
        currentRound: state => {
            return state.currentRound;
        },
        currentMode: state => {
            return state.currentMode;
        },
        totalRounds: state => {
            return state.totalSeasonRound;
        },
        currentDate: state => {
            return state.currentDate;
        }
    },
    mutations: {
        updateStandings(state, payload) {
            state.currentStandingsData = payload;
        },
        updateHeaders(state, payload) {
            state.currentStandingsHeader = payload;
        },
        updateYear(state, payload) {
            state.currentYear = payload;
        },
        updateRound(state, payload) {
            state.currentRound = payload;
        },
        updateMode(state, payload) {
            state.currentMode = payload;
        },
        updateSeasonRounds(state, payload) {
            state.totalSeasonRound = payload;
        },
        updateDate(state, payload) {
            state.currentDate = payload;
        }
    },
    actions: {
        async getNewStandings({ state, commit, dispatch }, payload) {
            var mode;
            if (!Object.is(payload, undefined)) {
                if (!(Object.is(payload.year, undefined) || isNaN(Number(payload.year)))) {
                    commit('updateYear', Number(payload.year));
                    console.log("Got year");
                }
                if (!(Object.is(payload.round, undefined) || isNaN(Number(payload.round)))) {
                    commit('updateRound', Number(payload.round));
                    console.log("Got round");
                }
                if (!Object.is(payload.mode, undefined)) {
                    mode = payload.mode;
                    console.log("Got mode");
                }
            }
            if (Object.is(mode, undefined)) mode = state.currentMode;
            var {exists, data} = await dispatch('checkIfCacheExists', { mode });
            if (!exists) {
                var url = '/standings/' + mode + '?year=' + state.currentYear + '&round=' + state.currentRound;
                data = await dispatch('getDataFromAPI', { url }, { root: true });
                dispatch('addDataToCache', {data, mode});
            }
            var standings;
            var tmp = [];
            var st, driverName, teamName, country, points, position, wins, number, obj, date;
            if (mode === "drivers") {
                standings = data.driver_standings[0].standings;
                date = data.driver_standings[0].race.date;
                for (var i = 0; i < standings.length; i++) {
                    st = standings[i];
                    driverName = st.driver.first_name + " " + st.driver.last_name;
                    country = st.driver.nationality;
                    number = st.driver.number;
                    points = st.points;
                    wins = st.wins;
                    position = st.position;
                    obj = {
                        Position: position,
                        Name: driverName,
                        Number: number,
                        Nationality: country,
                        Points: points,
                        Wins: wins,
                    };
                    tmp.push(obj);
                }
            }
            else {
                standings = data.team_standings[0].standings;
                date = data.team_standings[0].race.date;
                for (var j = 0; j < standings.length; j++) {
                    st = standings[j];
                    teamName = st.team.name;
                    country = st.team.country;
                    position = st.position;
                    points = st.points;
                    wins = st.wins;
                    obj = {
                        Position: position,
                        Name: teamName,
                        Country: country,
                        Points: points,
                        Wins: wins
                    }
                    tmp.push(obj);
                }
            }
            commit('updateStandings', tmp);
            commit('updateMode', mode);
            commit('updateDate', date);

        },
        async getRoundsInYear({ state, commit, dispatch }, payload) {
            if (!Object.is(payload, undefined)) {
                if (!(Object.is(payload.year, undefined) || isNaN(Number(payload.year)))) {
                    commit('updateYear', payload.year);
                }
            }
            var url = '/races/rounds?year=' + state.currentYear;

            var rounds = await dispatch('getDataFromAPI', { url }, { root: true });

            commit('updateSeasonRounds', Number(rounds));

        },
        addDataToCache({ state }, payload) {
            var key1;
            var mode = payload.mode;
            var data = payload.data;
            if (Object.is(mode, undefined)) mode = state.currentMode;
            if (mode === 'drivers') {
                key1 = 'DriverStandings';
            }
            else if (mode === 'teams') {
                key1 = "ConstructorStandings"
            }
            else {
                return;
            }
            var key2 = String(state.currentYear) + "_" + String(state.currentRound);
            var cache = localStorage.getItem(key1)
            if (cache === null) {
                localStorage.setItem(key1, JSON.stringify({}));
                cache = localStorage.getItem(key1);
            }
            cache = JSON.parse(cache);
            cache[key2] = data;
            localStorage.setItem(key1, JSON.stringify(cache));
        },
        checkIfCacheExists({ state }, payload) {
            var key1;
            var mode = payload.mode;
            if (Object.is(mode, undefined)) mode = state.currentMode;
            if (mode === 'drivers') {
                key1 = 'DriverStandings';
            }
            else if (mode === 'teams') {
                key1 = "ConstructorStandings"
            }
            else {
                return;
            }
            var cache = localStorage.getItem(key1);
            if (cache !== null) {
                var key2 = String(state.currentYear) + "_" + String(state.currentRound);
                if (!Object.is(JSON.parse(cache)[key2], undefined)) {
                    console.log("Found cache", JSON.parse(cache)[key2]);
                    return {exists: true, data:JSON.parse(cache)[key2]}
                }
            }
            return {exists: false, data: {}};
        }
    }
};