<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <v-col>
        <v-select
          hint="Choose a year"
          label="Season"
          :items="getSeasons"
          outlined
          @change="getRacesByYear"
        ></v-select>
      </v-col>
      <v-col cols="6">
        <v-select
          hint="Choose a race"
          label="Race"
          :items="getRaces"
          outlined
          @change="changeChosenRace"
        ></v-select>
      </v-col>
      <v-col>
        <v-select
          label="Session"
          :items="Sessions"
          outlined
          @change="changeMode"
        >
        </v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2"></v-col>
      <v-col>
        <v-card color="red accent-4">
          <v-card-title class="title">
            {{ getRaceName }} <v-spacer></v-spacer>
            {{ getRaceDate }}</v-card-title
          >
          <v-card-subtitle>
            <router-link
              :to="{
                name: 'Circuits',
                params: { circuitId: String(this.getCircuit.id) },
              }"
              class="circuit-link"
            >
              {{ getCircuit.name }}
            </router-link>
          </v-card-subtitle>
          <v-card-text>
            <v-btn rounded outlined @click="loadLapView"> Load lap-by-lap view </v-btn>
          </v-card-text>
          <RaceTable :headers="getHeaders" :data="getResultData"> </RaceTable>
        </v-card>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import RaceTable from "@/tables/RaceTable.vue";
import { mapGetters } from "vuex";

export default {
  props: {
    year: {
      type: String,
      default: undefined,
    },
    round: {
      type: String,
      default: undefined,
    },
    raceId: {
      type: Number,
      default: 0,
    },
  },
  components: {
    RaceTable,
  },
  data() {
    return {
      Sessions: ["Qualifying", "Race"],
    };
  },
  beforeMount() {
    if (this.raceId !== 0) {
      this.$store.dispatch("Results/getRaceResultsById", this.raceId);
      this.getRacesByYear();
    } else {
      if (!Object.is(this.year, undefined)) {
        this.$store.commit("Results/updateYear", this.year);
      }
      if (!(Object.is(this.round, undefined) || isNaN(Number(this.round)))) {
        this.$store.commit("updateRound", Number(this.round));
      }
      this.getRacesByYear();
      this.getResults();
    }
  },
  computed: {
    ...mapGetters({
      getSeasons: "Seasons",
      getYear: "Results/currentYear",
      getRound: "Results/currentRound",
      getRaces: "Results/currentRaceList",
      getRaceName: "Results/currentRaceName",
      getRaceDate: "Results/currentRaceDate",
      getCircuit: "Results/currentRaceCircuit",
      getResultData: "Results/resultsData",
      getHeaders: "Results/currentHeader",
    }),
  },
  methods: {
    async changeChosenRace(round) {
      this.$store.commit("Results/updateRound", Number(round));
      await this.$store.dispatch("Results/getNewResults", {});
    },
    async changeMode(mode) {
      this.$store.commit("Results/updateMode", mode.toLowerCase());
      await this.$store.dispatch("Results/getNewResults", {});
    },
    async getRacesByYear(year) {
      this.$store.dispatch("Results/getRacesInYear", { year });
    },
    async getResults() {
      await this.$store.dispatch("Results/getNewResults", {});
    },
    async loadLapView() {
      console.log("Do stuff");
    },
  },
};
</script>
<style scoped>
.v-card__title {
  color: white !important;
}
.v-card__subtitle {
  color: white !important;
}
.v-card__text {
  text-align: center !important;
  font-size: large !important;
  color: white !important;
}
.circuit-link {
  color: black !important;
}
</style>