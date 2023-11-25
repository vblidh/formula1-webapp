import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const useStandingsStore = defineStore('standings', () => {
  const driverStandings = ref([])
  const constructorStandings = ref([])

  const getStandings = computed(() =>
    getSelectedStandingType.value === 'drivers'
      ? driverStandings.value
      : constructorStandings.value
  )

  const selectedStandingType = ref('drivers')
  const getSelectedStandingType = computed(() => {
    return selectedStandingType.value
  })

  const setDriverStandings = function (standings) {
    driverStandings.value = standings
  }
  const setConstructorStandings = function (standings) {
    constructorStandings.value = standings
  }
  const setSelectedStandingType = function (type) {
    selectedStandingType.value = type
  }

  return {
    getStandings,
    setDriverStandings,
    setConstructorStandings,
    selectedStandingType,
    getSelectedStandingType,
    setSelectedStandingType
  }
})

export default useStandingsStore
