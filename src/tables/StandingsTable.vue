<template>
  <v-container fill-height>
    <v-row>
      <v-col cols="2"></v-col>
      <v-col>
        <v-card color="red accent-4">
          <v-card-title
            ><v-spacer></v-spacer> {{ this.getTitle }} <v-spacer></v-spacer
          ></v-card-title>
          <v-card-subtitle> {{ this.getSubtitle }} </v-card-subtitle>
          <v-list-item two-line>
            <v-switch
              :input-value="getSwitchState"
              :label="modeText"
              hint="Choose which championship standing to see"
              @change="swapMode"
            >
            </v-switch>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-autocomplete
              outlined
              label="Select year"
              :items="getSeasons"
              @change="onChangeYear"
            ></v-autocomplete>
          </v-list-item>
          <v-slider
            hint="Choose which round of season to display standings from"
            label="Round"
            min="1"
            :max="getRounds"
            v-model="round"
            color="red accent-4"
            background-color="red accent-4"
            hide-details="auto"
            thumb-label="always"
            thumb-color="black"
            track-fill-color="black"
            append-icon="mdi-plus-thick"
            prepend-icon="mdi-minus-thick"
            @change="onChoseRound"
            @click:prepend="previousRound"
            @click:append="nextRound"
          ></v-slider>
          <v-container>
            <v-data-table
              :items="getItems"
              :headers="getHeaders"
              disable-sort
              disable-pagination
              :loading="isLoading"
              hide-default-footer
              class="elevation-1"
              loading-text="Loading standings..."
              no-data-text="No standings found for those parameters"
            >
            </v-data-table>
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      round: 1,
      years: [],
      modeText: "",
      title: "",
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      getItems: "StandingsModule/currentStandingsData",
      getHeaders: "StandingsModule/currentStandingsHeader",
      getRounds: "StandingsModule/totalRounds",
      getRound: "StandingsModule/currentRound",
      getSeasons: "Seasons",
      getMode: "StandingsModule/currentMode",
      getYear: "StandingsModule/currentYear",
      getDate: "StandingsModule/currentDate",
    }),
    getTitle() {
      return this.getYear + " " + this.modeText + " World Championship";
    },
    getSwitchState() {
      return this.getMode === "drivers" ? 1 : 0;
    },
    getSubtitle() {
      return this.getDate + " - Round " + this.getRound;
    },
  },
  methods: {
    onChoseRound(value) {
      // var queries = Object.assign({}, this.$route.query);
      // queries.round = value;
      // this.$router.replace({ query: queries });
      this.$store.commit("StandingsModule/updateRound", value);
      this.$store.dispatch("StandingsModule/getNewStandings", {});
    },
    async onChangeYear(value) {
      console.log(value);
      await this.$store.dispatch("StandingsModule/getNewStandings", { year: value, round: 1 });
      await this.$store.dispatch("StandingsModule/getRoundsInYear");
      this.title = this.getYear + " " + this.modeText + " World Championship";
    },
    nextRound() {
      if (this.getRound < this.getRounds) {
        var newValue = this.getRound + 1;
        this.round = newValue;
        this.onChoseRound(newValue);
      }
    },
    previousRound() {
      if (this.getRound > 1) {
        var newValue = this.getRound - 1;
        this.round = newValue;
        this.onChoseRound(newValue);
      }
    },
    async swapMode(value) {
      var mode;
      if (value) {
        mode = "drivers";
        this.modeText = "Drivers";
      } else {
        mode = "teams";
        this.modeText = "Constructors";
      }
      await this.$store.dispatch("StandingsModule/getNewStandings", { mode });
    },
  },
  mounted() {
    if (this.getMode === "drivers") {
      this.modeText = "Drivers";
    } else {
      this.modeText = "Constructors";
    }
    this.$store.dispatch("StandingsModule/getRoundsInYear");
  },
};
</script>

<style scoped>
.elevation-1 {
  background: whitesmoke !important;
}
.v-card__title {
  color: white !important;
}
.v-card__subtitle {
  color: white !important;
}
</style>