import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const useRaceStore = defineStore('races', () => {
  const races = ref({})
  // const getRace = computed(id => races[id])
  const getRace = function (id) {
    console.log(races.value)
    return races[id]
  }

  const getRaceComputed = computed(() => id => {
    console.log(id)
    return races[id]
  })
  const storeRace = function (race) {
    races.value[race.id] = race
  }

  return { races, getRace, getRaceComputed, storeRace }
})

export default useRaceStore
