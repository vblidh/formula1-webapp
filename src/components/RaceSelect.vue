
<script setup>
import { onMounted, ref } from 'vue'
import useSeasonStore from '../stores/seasons'
import useFetch from '../hooks/useFetch'

const { fetchData } = useFetch
const seasonStore = useSeasonStore()

const props = defineProps({
  onSelectRace: Function,
  buttonText: String
})

const selectedSeason = ref('')
const racesInSelectedSeason = ref(0)
const selectedRound = ref(1)



onMounted(async () => {
  if (seasonStore.getSeasons.length == 0) {
    const seasons = await fetchData('/api/seasons')
    seasonStore.storeSeasons(seasons.sort((s1, s2) => s2.year - s1.year))
  }
})


const onSeasonSelected = async (e) => {
  // TODO check store first
  const year = e.target.value
  selectedSeason.value = year
  seasonStore.setSelectoedSeason(Number(year))
  const roundsInYear = await fetchData(`/api/races/rounds/${year}`)
  if (roundsInYear.rounds > 0) {
    racesInSelectedSeason.value = roundsInYear.races
    selectedRound.value = 1
    seasonStore.setSelectedRound(1)
    seasonStore.setRacesInSelectedSeason(racesInSelectedSeason.value.length)
  }
}

const onRoundSelected = (e) => {
  selectedRound.value = e.target.value
  seasonStore.setSelectedRound(Number(e.target.value))
}

const onButtonClicked = async () => {
  // const raceData = await fetchData(`/api/races/${selectedSeason.value}/${selectedRound.value}`)
  // race.value = raceData
  // raceId.value = raceData.id
  await props.onSelectRace(selectedSeason.value, selectedRound.value)
}
</script>

<template>
  <div>
    <v-card>
      <v-card-item>
        <!-- <v-card-title v-if="race.id">{{ race?.name }}: {{ new Date(race.date).toLocaleString() }}</v-card-title> -->
        <!-- <v-card-title v-else>Loading...</v-card-title> -->
      </v-card-item>
      <v-card-actions>
        <v-row class="action-row">
          <v-col cols="3">
            <select v-model="selectedSeason" class="season-select" @change="onSeasonSelected">
              <option v-for="season in seasonStore.getSeasons" :value="season.year">{{ season.year }}</option>
            </select>
          </v-col>
          <v-col cols="4">
            <select v-model="seasonStore.getSelectedRound" class="round-select" @change="onRoundSelected">
              <option v-for="(race, i) in racesInSelectedSeason" :value="i + 1">{{ race }}
              </option>
            </select>
          </v-col>
          <v-col cols="3">
            <button class="load-race-data-btn" @click="onButtonClicked">{{ props.buttonText }}</button>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>


<style lang="scss" scoped>
.load-race-data-btn {
  background-color: #1976D2;
  color: white;
  border-radius: 20px;
  border: none;
  text-align: center;
  min-height: 30px;
  width: 100%;
}

.round-select {
  width: 100%;
}

.season-select {
  width: 100%;
}

.load-race-data-btn:hover {
  background-color: black;
}

.action-row {
  justify-content: center;
  align-items: center;
}
</style>