export default {
    namespaced: true,
    state: {
        DriverList: [],
        ChosenDriver: {},
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
        Poles: state => state.Poles,
    },
    mutations: {
        updateDriverList(state, payload) {
            state.DriverList = payload;
        },
        updateChosen(state, payload) {
            state.ChosenDriver = payload;
        },
        updatePodiums(state, payload) {
            state.Podiums = payload;
        },
        updatePoles(state, payload) {
            state.Poles = payload;
        },
        updateWins(state, payload) {
            state.Wins = payload;
        }
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
            console.log("Podiums:", raceData);
            console.log("Poles:", poles);
            commit('updatePodiums', raceData.podiums);
            commit('updateWins', raceData.wins);
            commit('updatePoles', poles);
        },
    }
};