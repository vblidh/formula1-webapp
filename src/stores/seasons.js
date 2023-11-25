import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const useSeasonStore = defineStore('seasons', () => {
  const _seasons = ref([])
  const getSeasons = computed(() => _seasons.value)
  const storeSeasons = function (seasons) {
    _seasons.value = seasons
  }

  const selectedSeason = ref(0)
  const getSelectedSeason = computed(() => selectedSeason.value)
  const setSelectoedSeason = function (season) {
    selectedSeason.value = season
  }

  const selectedRound = ref(1)
  const getSelectedRound = computed(() => selectedRound.value)
  const setSelectedRound = function (round) {
    selectedRound.value = round
  }

  const racesInSelectedSeason = ref(0)
  const getRacesInSelectedSeason = computed(() => racesInSelectedSeason.value)
  const setRacesInSelectedSeason = function (numberOfRaces) {
    racesInSelectedSeason.value = numberOfRaces
  }

  return {
    getSeasons,
    storeSeasons,
    getSelectedRound,
    setSelectedRound,
    getSelectedSeason,
    setSelectoedSeason,
    getRacesInSelectedSeason,
    setRacesInSelectedSeason
  }
})

export default useSeasonStore
