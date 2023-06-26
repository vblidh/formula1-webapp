import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const useResultsStore = defineStore('results', () => {
  const results = ref({})
  const selectedRaceResults = ref([])
  const getSelectedRaceResults = computed(() => selectedRaceResults.value)
  const getResult = function (raceId) {
    console.log('ResultStore')
    console.log(raceId)
    console.log(results)
    setSelectedRaceResults(results[raceId] ?? [])
    return results[raceId] ?? []
  }

  const storeResult = function (raceId, result) {
    setSelectedRaceResults(result)
    results[raceId] = result
  }

  const setSelectedRaceResults = function (results) {
    selectedRaceResults.value = results
  }

  return { getResult, storeResult, getSelectedRaceResults }
})

export default useResultsStore
