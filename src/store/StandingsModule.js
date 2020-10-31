export default {
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
            //TODO: Add team columns
        ],
        currentYear: 2020,
        currentMode: "drivers",
        currentRound: 1,
        totalSeasonRound: 0,

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
        }
    },
    actions: {
        async getNewStandings({ state, commit, dispatch }, payload) {

            if (!Object.is(payload, undefined)) {
                if (!(Object.is(payload.year, undefined) || isNaN(Number(payload.year)))){
                    commit('updateYear', Number(payload.year));
                }
                if (!(Object.is(payload.round, undefined) || isNaN(Number(payload.round)))){
                    commit('updateRound', Number(payload.round));
                }
                if (Object.is(payload.mode, String)) {
                    commit('updateMode', payload.mode)
                }
            }
            var url = '/standings/' + state.currentMode + '?year=' + state.currentYear + '&round=' + state.currentRound;

            var data = await dispatch('getDataFromAPI', { url });
            var standings;
            if (state.currentMode === "drivers") {
                standings = data.driver_standings[0].standings;
            }
            else {
                standings = data.team_standings[0].standings;
            }
            var tmp = [];
            for (var i = 0; i < standings.length; i++) {
                var st = standings[i];
                var driverName = st.driver.first_name + " " + st.driver.last_name;
                var nationality = st.driver.nationality;
                var number = st.driver.number;
                var points = st.points;
                var wins = st.wins;
                var position = st.position;
                var obj = {
                    Position: position,
                    Name: driverName,
                    Number: number,
                    Nationality: nationality,
                    Points: points,
                    Wins: wins,
                };
                tmp.push(obj);

            }

            commit('updateStandings', tmp);
        },
        async getRoundsInYear({ state, commit, dispatch }, payload) {
            if (!Object.is(payload, undefined)){
                if (!(Object.is(payload.year, undefined) || isNaN(Number(payload.year)))) {
                    commit('updateYear', payload.year);
                }
            }
            var url = '/races/rounds?year=' + state.currentYear;

            var rounds = await dispatch('getDataFromAPI', { url });

            commit('updateSeasonRounds', Number(rounds));

        },
    }
};