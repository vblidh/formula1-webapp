import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const useSeasonStore = defineStore('seasons', () => {
  const _seasons = ref([])
  const getSeasons = computed(() => _seasons.value)
  const storeSeasons = function (seasons) {
    _seasons.value = seasons
  }

  return { getSeasons, storeSeasons }
})

export default useSeasonStore
