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
            //TODO: Add driver columns
        ],
        currentYear: 2020,
        currentMode: "drivers",
        currentRound: 1,

    },
    getters: {
        currentStandingsData: state => {
            return state.currentStandingsData;
        },
        currentStandingsHeader: state => {
            if (state.mode == "drivers") {
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

    },
    actions: {
        async getNewStandings({ state, commit, dispatch }, payload) {
            var year = Object.is(payload.year, undefined) ? state.currentYear : payload.year;
            var round = Object.is(payload.round, undefined) ? state.currentRound : payload.round;
            var mode = Object.is(payload.mode, undefined) ? state.currentMode : payload.mode;

            var url = '/standings/' + mode + '?year=' + year + '&round=' + round;

            var data = await dispatch('getDataFromAPI', { url });
            var standings;
            if (mode == "drivers") {
                standings = data.driver_standings.standings;
            }
            else {
                standings = data.team_standings.standings;
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




        }
    }
};