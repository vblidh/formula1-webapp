
<script setup>
import { onMounted, ref } from 'vue'
import useFetch from '../hooks/useFetch'
import useRaceStore from '../stores/races'
import useResultsStore from '../stores/results'
import useSeasonsStore from '../stores/seasons'
import { useRoute } from 'vue-router'
import DataTable from '../components/DataTable.vue'

const { fetchData } = useFetch
const route = useRoute()
const raceStore = useRaceStore()
const resultStore = useResultsStore()
const seasonStore = useSeasonsStore()

const raceId = ref(0)
const race = ref({})
const selectedSeason = ref('')
const racesInSelectedSeason = ref(0)
const selectedRound = ref(1)

const headers = [
  {
    title: 'Position',
    type: 'int',
    sortable: true,
    key: 'positionOrder'
  },
  {
    title: 'Driver',
    type: 'string',
    sortable: false,
    renderValue: (item => `${item.driver.forename} ${item.driver.surname}`)
  },
  {
    title: 'Team',
    type: 'string',
    sortable: true,
    renderValue: (item => item.constructor.name)
  },
  {
    title: 'Grid',
    type: 'int',
    sortable: true,
    key: 'grid'
  },
  {
    title: 'Time',
    type: 'string',
    sortable: false,
    renderValue: (item) => item.time ? item.time : item.status
  },
  {
    title: 'Fastest Lap time',
    type: 'string',
    sortable: true,
    key: 'fastestLapTime'
  }
]

onMounted(async () => {
  let fetchedRace
  const p = route.params
  if (seasonStore.getSeasons.length === 0) {
    const seasons = await fetchData('/api/seasons')
    seasonStore.storeSeasons(seasons.sort((s1, s2) => s2.year - s1.year))
  }
  if (p.raceId) {
    fetchedRace = await fetchData(`/api/races/${p.raceId}`)
    raceStore.storeRace(fetchedRace)
  }
  else if (route.query.year) {
    const query = route.query
    fetchedRaces = await fetchData(`/api/races?year=${query.year}&pageSize=30`)
  }
  raceId.value = fetchedRace.id
  raceStore.storeRace(fetchedRace)
  race.value = fetchedRace
  if (!resultStore.getResult(raceId.value).length > 0) {
    const data = await fetchData(`/api/results/race/${raceId.value}`)
    const results = data.sort((a, b) => a.positionOrder - b.positionOrder)
    resultStore.storeResult(raceId.value, results)
  }
})

const onSeasonSelected = async (e) => {
  // TODO check store first
  const year = e.target.value
  const roundsInYear = await fetchData(`/api/races/rounds/${year}`)
  if (roundsInYear.rounds > 0) {
    racesInSelectedSeason.value = roundsInYear.races
    selectedRound.value = 1
  }
}

const onRoundSelected = (e) => {  
  selectedRound.value = e.target.value
}

const onButtonClicked = async () => {
  const race = await fetchData(`/api/races/${selectedSeason.value}/${selectedRound.value}`)
  raceStore.storeRace(race)
  race.value = race
  raceId.value = race.id
  if (resultStore.getResult(race.id).length == 0) {
    const results = await fetchData(`/api/results/race/${race.id}`)
    resultStore.storeResult(race.id, results)
  }
}
</script>

<template>
  <div>
    <v-card>
      <v-card-item>
        <v-card-title v-if="race.id">{{ race?.name }}: {{ new Date(race.date).toLocaleString() }}</v-card-title>
        <v-card-title v-else>Loading...</v-card-title>
      </v-card-item>
      <v-card-actions>
        <v-row class="action-row">
          <v-col cols="4">
            <select v-model="selectedSeason" class="season-select" @change="onSeasonSelected">
              <option v-for="season in seasonStore.getSeasons" :value="season.year">{{ season.year }}</option>
            </select>
          </v-col>
          <v-col cols="4">
            <select v-model="selectedRound" class="round-select" @click="onRoundSelected">
              <option v-for="(race, i) in racesInSelectedSeason" :value="i + 1">{{ race }}
              </option>
            </select>
          </v-col>
          <v-col cols="3">
            <button class="load-race-data-btn" @click="onButtonClicked">Load Race Results</button>
          </v-col>
        </v-row>
      </v-card-actions>
      <v-card-text>
        <DataTable :headers="headers" :items="resultStore.getSelectedRaceResults" :hide-pagination="true" />
      </v-card-text>
    </v-card>
  </div>
</template>

<style lang="css" scoped>
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