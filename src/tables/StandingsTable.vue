<template>
  <v-container>
    <v-card>
      <v-card-title
        ><v-spacer></v-spacer> {{ this.title }} <v-spacer></v-spacer
      ></v-card-title>
      <v-card-subtitle>subtitle</v-card-subtitle>
      <v-list-item two-line>
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
        background-color="white"
        hide-details="auto"
        thumb-label="always"
        append-icon="mdi-plus-thick"
        prepend-icon="mdi-minus-thick"
        @change="onChoseRound"
        @click:prepend="previousRound"
        @click:append="nextRound"
      ></v-slider>
      <v-data-table
        :items="getItems"
        :headers="getHeaders"
        disable-sort
        disable-pagination
        :loading="isLoading"
        hide-default-footer
        loading-text="Loading standings..."
        no-data-text="No standings found for those parameters"
      >
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    title: {
      type: String,
    },
    date: {
      type: String,
    },
    isLoading: {
      type: Boolean,
    },
    rounds: {
      type: Number,
    },
  },
  data() {
    return {
      round: 1,
      years: [],
    };
  },
  computed: {
    ...mapGetters({
      getItems: "currentStandingsData",
      getHeaders: "currentStandingsHeader",
      getRounds: "totalRounds",
      getRound: "currentRound",
      getSeasons: "Seasons",
    }),
  },
  methods: {
    onChoseRound(value) {
      var queries = Object.assign({}, this.$route.query);
      queries.round = value;
      this.$router.replace({ query: queries });
      this.$store.commit("updateRound", value);
      this.$store.dispatch("getNewStandings", {});
    },
    async onChangeYear(value) {
      console.log(value);
      await this.$store.dispatch("getNewStandings", { year: value, round: 1 });
      await this.$store.dispatch("getRoundsInYear");
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
  },
  mounted() {
    this.$store.dispatch("getRoundsInYear");
  },
};
</script>

<style scoped>
</style>