
export default {
    namespaced: true,
    state: {
        DriverList: [],
        ChosenDriver: {},
        LastRaces: [],
        SeasonResults: [],
        PageSize: 5,
        CurrentPage: 1,
        TotalRaces: 0,
        Podiums: 0,
        Wins: 0,
        Poles: 0,
        IsLoadingRaceResults: false,
        IsLoadingSeasonResults: false,
    },
    getters: {
        DriverList: state => {
            return state.DriverList;
        },
        ChosenDriver: state => state.ChosenDriver,
        Podiums: state => state.Podiums,
        Wins: state => state.Wins,
        TotalRaces: state => state.TotalRaces,
        CurrentPage: state => state.CurrentPage,
        PageSize: state => state.PageSize,
        Poles: state => state.Poles,
        LastResults: state => state.LastRaces,
        SeasonResults: state => state.SeasonResults,
        IsLoadingRaceResults: state => state.IsLoadingRaceResults,
        IsLoadingSeasonResults: state => state.IsLoadingSeasonResults
    },
    mutations: {
        updateDriverList(state, payload) {
            state.DriverList = payload;
        },
        updateChosen(state, payload) {
            state.ChosenDriver = payload;
        },
        updateTotalRaces(state, payload) {
            state.TotalRaces = payload;
        },
        updatePageSize(state, payload) {
            state.PageSize = payload;
        },
        updateCurrentPage(state, payload) {
            state.CurrentPage = payload;
        },
        updatePodiums(state, payload) {
            state.Podiums = payload;
        },
        updatePoles(state, payload) {
            state.Poles = payload;
        },
        updateWins(state, payload) {
            state.Wins = payload;
        },
        updateLastRaces(state, payload) {
            state.LastRaces = payload;
        },
        updateSeasonResults(state, payload) {
            state.SeasonResults = payload;
        },
        toggleIsLoadingRaceResults(state) {
            state.IsLoadingRaceResults = !state.IsLoadingRaceResults;
        },
        toggleIsLoadingSeasonResults(state) {
            state.IsLoadingSeasonResults = !state.IsLoadingSeasonResults;
        },
    },
    actions: {
        async getDrivers({ state, commit, dispatch }) {
            if (state.DriverList.length > 0) return; // Drivers already loaded 
            var url = "/drivers";
            var data = await dispatch('getDataFromAPI', { url }, { root: true });
            console.log(data);
            commit('updateDriverList', data);
        },
        setChosenDriver({ state, commit }, payload) {
            if (Object.is(payload, undefined) || Object.is(payload.id, undefined)) return false;
            var id = payload.id;
            var driver = state.DriverList.find(driver => driver.id === id);
            if (Object.is(driver, undefined)) return false;
            commit('updateChosen', driver);
            return true;
        },
        async getDriverStats({ state, commit, dispatch }) {
            var podiumUrl = '/drivers/' + state.ChosenDriver.id + '/podiums';
            var poleUrl = '/drivers/' + state.ChosenDriver.id + '/poles';
            const podiumTask = dispatch('getDataFromAPI', { url: podiumUrl }, { root: true });
            const poleTask = dispatch('getDataFromAPI', { url: poleUrl }, { root: true });
            var [raceData, poleData] = [await podiumTask, await poleTask];
            commit('updatePodiums', raceData.podiums);
            commit('updateWins', raceData.wins);
            commit('updatePoles', poleData.poles);
        },
        async getLastRaces({ state, commit, dispatch }, payload) {
            var page, pageSize;
            if (!Object.is(payload, undefined)) {
                page = Object.is(payload.page, undefined) ? state.CurrentPage : payload.page;
                pageSize = Object.is(payload.pageSize) ? state.PageSize : payload.pageSize;
            }
            else {
                page = state.CurrentPage;
                pageSize = state.PageSize;
            }
            commit('toggleIsLoadingRaceResults');
            var url = '/results/driver/' + state.ChosenDriver.id + '?page=' + page + '&page_size=' + pageSize;
            var response = await dispatch('getDataFromAPI', { url }, { root: true });
            var data = response.data;
            var tmp = [];
            var obj;
            data.forEach(result => {
                obj = {
                    Race: result.race.name,
                    Date: result.race.date,
                    Pos: result.position,
                    Grid: result.grid
                };
                tmp.push(obj);
            });

            commit('updateTotalRaces', response.pagination.totalItems);
            commit('updateLastRaces', tmp);
            commit('toggleIsLoadingRaceResults');
        },
        async getSeasonResults({ state, commit, dispatch }) {
            commit('toggleIsLoadingSeasonResults');
            var url = '/standings/drivers/' + state.ChosenDriver.id;
            var response = await dispatch('getDataFromAPI', { url }, { root: true });
            var data = response.data;
            var tmp = [];
            var obj;
            data.forEach(seasonRes => {
                obj = {
                    Year: seasonRes.race.year,
                    Team: seasonRes.team.name,
                    Wins: seasonRes.wins,
                    Points: seasonRes.points,
                    Pos: seasonRes.position
                };
                tmp.push(obj);
            });
            commit('updateSeasonResults', tmp);
            commit('toggleIsLoadingSeasonResults');
        }
    }
};