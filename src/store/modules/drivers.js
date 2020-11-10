export default {
    namespaced: true,
    state: {
        DriverList: [],
        ChosenDriver: {},
    },
    getters: {
        DriverList: state => {
            return state.DriverList;
        },
        ChosenDriver: state => state.ChosenDriver,

    },
    mutations: {
        updateDriverList(state, payload) {
            state.DriverList = payload;
        },
        updateChosen(state, payload) {
            state.ChosenDriver = payload;
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
        }
    }
};