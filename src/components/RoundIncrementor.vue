<script setup>
import useSeasonStore from '../stores/seasons'


const seasonStore = useSeasonStore()

const props = defineProps({
  selectedRound: Number,
  onRoundChange: Function
})


const handleRoundChange = (roundChange) => {
  seasonStore.setSelectedRound(seasonStore.getSelectedRound + roundChange)
  if (props.onRoundChange && typeof props.onRoundChange === 'function') {
    props.onRoundChange(roundChange)
  }

}
</script>
<template>
  <v-row class="round-text">
    <h4>Round {{ seasonStore.getSelectedRound }}</h4>
  </v-row>
  <v-row class="round-row">
    <p v-if="seasonStore.getSelectedRound > 1">{{ seasonStore.getSelectedRound - 1 }}</p>
    <v-icon v-show="seasonStore.getSelectedRound > 1" icon="mdi-chevron-left" size="large" aria-hidden="false"
      class="round-icon" @click="handleRoundChange(-1)" />
    <v-icon v-show="seasonStore.getSelectedRound < seasonStore.getRacesInSelectedSeason" icon="mdi-chevron-right"
      size="large" aria-hidden="false" class="round-icon" @click="handleRoundChange(1)" />
    <p v-if="seasonStore.getSelectedRound < seasonStore.getRacesInSelectedSeason">{{ seasonStore.getSelectedRound + 1
    }}</p>
  </v-row>
</template>

<style lang="scss" scoped>
.round-row {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 80%;
  // margin: 0 auto;
  // padding: 0 2%;  
}

.round-text {
  margin-bottom: -40%;
}

.round-icon {
  cursor: pointer;
}

.round-icon:hover {
  background-color: grey;
}
</style>