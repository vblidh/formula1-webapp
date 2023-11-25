<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import useFetch from '../hooks/useFetch'
import useSeasonsStore from '../stores/seasons'
import useStandingsStore from '../stores/standings'
import DataTable from '../components/DataTable.vue'
import RaceSelect from '../components/RaceSelect.vue'
import RoundIncrementor from '../components/RoundIncrementor.vue'

const tableHeadersForDriverStandings = [
  {
    title: 'Name',
    type: 'string',
    sortable: false,
    renderValue: (item => `${item.driver.forename} ${item.driver.surname}`)
  },
  {
    title: 'Constructor',
    type: 'string',
    sortable: true,
    renderValue: (item => item.constructor.name)
  },
  {
    title: 'Nationality',
    type: 'string',
    sortable: false,
    renderValue: (item => item.driver.nationality)
  },
  {
    title: 'Wins',
    type: 'int',
    sortable: true,
    renderValue: (item => item.wins)
  },
  {
    title: 'Poles',
    type: 'int',
    sortable: true,
    renderValue: (item => item.poles)
  },
  {
    title: 'Points',
    type: 'int',
    sortable: true,
    renderValue: (item => item.points)
  },
]

const tableHeadersForConstructorStandings = [
  {
    title: 'Name',
    type: 'string',
    sortable: false,
    renderValue: (item => item.constructor.name)
  },
  {
    title: 'Drivers',
    type: 'string',
    sortable: true,
    renderValue: (item => item.drivers.reduce((acc, curr) => `${acc} ${curr.code},`, ''))
  },
  {
    title: 'Nationality',
    type: 'string',
    sortable: false,
    renderValue: (item => item.constructor.nationality)
  },
  {
    title: 'Wins',
    type: 'int',
    sortable: true,
    renderValue: (item => item.wins)
  },
  {
    title: 'Poles',
    type: 'int',
    sortable: true,
    renderValue: (item => item.poles)
  },
  {
    title: 'Points',
    type: 'int',
    sortable: true,
    renderValue: (item => item.points)
  },
]

const tableHeaders = computed(() => {
  if (standingsStore.getSelectedStandingType === 'drivers') {
    return tableHeadersForDriverStandings
  }
  return tableHeadersForConstructorStandings
})

const { fetchData } = useFetch
const standingsStore = useStandingsStore()
const seasonStore = useSeasonsStore()
const route = useRoute()
const selectedRound = ref(1)
const selectedYear = ref(1950)

onMounted(async () => {
  var p = route.params
  var q = route.query
  let data
  if (p.raceId) {
    data = await fetchData(`/api/standings/race/${p.raceId}`)
    standingsStore.setDriverStandings(data.drivers)
    standingsStore.setConstructorStandings(data.constructors)
  }
  if (q.year && q.round) {
    data = await fetchData(`/api/standings/race`, { year: q.year, round: q.round })
    standingsStore.setDriverStandings(data.drivers)
    standingsStore.setConstructorStandings(data.constructors)
  }
})

const onSelectRace = async (year, round) => {
  if (year && round) {
    selectedYear.value = year
    const data = await fetchData(`/api/standings/race`, { year, round })
    standingsStore.setDriverStandings(data.drivers)
    standingsStore.setConstructorStandings(data.constructors)
  }
}

// const onRoundSelected = (value) => {
//   selectedRound.value = Number(value)
// }

const onRoundIncrement = async () => {
  const data = await fetchData(`/api/standings/race`, { year: seasonStore.getSelectedSeason, round: seasonStore.getSelectedRound })
    standingsStore.setDriverStandings(data.drivers)
    standingsStore.setConstructorStandings(data.constructors)
}

</script>

<template>
  <v-container>
    <!-- <div class="radio-group" >
      <v-radio-group v-model="standingsStore.selectedStandingType">
        <v-radio value="drivers">Drivers</v-radio>
        <v-radio value="constructors">Constructors</v-radio>
      </v-radio-group>
    </div> -->
    <v-row class="filter-row">
      <v-col cols="9">
        <RaceSelect :onSelectRace="onSelectRace" buttonText="Load standings" />
      </v-col>
      <v-col cols="2" class="round-column">
        <RoundIncrementor :selectedRound="selectedRound" :onRoundChange="onRoundIncrement" />
      </v-col>
    </v-row>
    <DataTable :items="standingsStore?.getStandings" :headers="tableHeaders" :hidePagination="true" />
  </v-container>
</template>

<style lang="css" scoped>
.radio-group {
  width: 60%;
  display: flex;
  flex-direction: column;
  ;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}

.round-column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.filter-row {
  margin-bottom: 15px;
}
</style>