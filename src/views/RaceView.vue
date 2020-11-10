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
      <v-col>
        <v-btn x-large @click="getResults">Collect Data</v-btn>
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
          <v-card-subtitle>{{ getCircuit }}</v-card-subtitle>
          <RaceTable :headers="getHeaders" :data="getResultData">
          </RaceTable>
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
    if (!Object.is(this.year, undefined)) {
      this.$store.commit("Results/updateYear", this.year);
    }
    if (!(Object.is(this.round, undefined) || isNaN(Number(this.round)))) {
      this.$store.commit('updateRound', Number(this.round));
    }
    this.getRacesByYear();
    this.getResults();
  },
  computed: {
    ...mapGetters({
      getSeasons: "Seasons",
      getYear: "Results/currentYear",
      getRound: "Results/currentRound",
      getRaces: "Results/currentRaceList",
      getRaceName: "Results/currentRaceName",
      getRaceDate: "Results/currentRaceDate",
      getCircuit: "Results/currentRaceCircuitName",
      getResultData: "Results/resultsData",
      getHeaders: "Results/currentHeader",
    }),
  },
  methods: {
    // async test() {
    //   try {
    //     var resp = await this.$store.dispatch("getDataFromAPI", {
    //       url: "results/race?year=2020&round=11",
    //     });
    //     console.log("Resp from store:", resp);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    async changeChosenRace(round){
      this.$store.commit('Results/updateRound', Number(round));
      await this.$store.dispatch('Results/getNewResults', {});
    },
    async changeMode(mode){
      this.$store.commit('Results/updateMode', mode.toLowerCase());
      await this.$store.dispatch('Results/getNewResults', {});
    },
    async getRacesByYear(year) {
      this.$store.dispatch("Results/getRacesInYear", { year });
    },
    async getResults() {
      await this.$store.dispatch('Results/getNewResults', {});
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
</style>