
export default {
    namespaced: true,
    state: {
        DriverList: [],
        ChosenDriver: {},
        LastRaces: [],
        PageSize : 7,
        CurrentPage: 1,
        TotalRaces: 0,
        Podiums: 0,
        Wins: 0,
        Poles: 0,
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
        
    },
    mutations: {
        updateDriverList(state, payload) {
            state.DriverList = payload;
        },
        updateChosen(state, payload) {
            state.ChosenDriver = payload;
        },
        updateTotalRaces(state, payload){
            state.TotalRaces = payload;
        },
        updatePageSize(state, payload){
            state.PageSize = payload;
        },
        updateCurrentPage(state, payload){
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
    },
    actions: {
        async getDrivers({ state, commit, dispatch }) {
            if (state.DriverList.length > 0) return; // Drivers already loaded 

            var url = "/drivers";
            var data = await dispatch('getDataFromAPI', { url }, { root: true });
            commit('updateDriverList', data.Drivers);
        },
        setChosenDriver({ state, commit }, payload) {
            if (Object.is(payload, undefined) || Object.is(payload.id, undefined)) return false;
            var id = payload.id;
            // console.log(state.DriverList);
            console.log(id);
            var driver = state.DriverList.find(driver => driver.id === id);
            console.log("Driver:", driver);
            if (Object.is(driver, undefined)) return false;
            commit('updateChosen', driver);
            return true;
        },
        async getDriverStats({ state, commit, dispatch }) {
            var podiumUrl = '/drivers/podiums/' + state.ChosenDriver.id;
            var poleUrl = '/drivers/poles/' + state.ChosenDriver.id
            const podiumTask = dispatch('getDataFromAPI', { url: podiumUrl }, { root: true });
            const poleTask = dispatch('getDataFromAPI', { url: poleUrl }, { root: true });
            var [raceData, poles] = [await podiumTask, await poleTask];
            commit('updatePodiums', raceData.podiums);
            commit('updateWins', raceData.wins);
            commit('updatePoles', poles);
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
            
            var url = '/results/race/' + state.ChosenDriver.id + '?page=' + page + '&page_size=' + pageSize;
            console.log(url);
            var response = await dispatch('getDataFromAPI', { url }, { root: true });
            console.log(response);
            var data = response.data;
            var tmp = [];
            var obj;
            data.forEach(result => {
                obj = {
                    Race: result.race.name,
                    Date: result.race.date,
                    Pos: result.position_order,
                    Grid: result.grid
                };
                tmp.push(obj);
            });
            
            commit('updateTotalRaces', response.total_entries);
            commit('updateLastRaces', tmp);
        }
    }
};