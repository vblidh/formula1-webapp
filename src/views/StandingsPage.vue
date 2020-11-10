<template>
  <StandingsTable></StandingsTable>
</template> 

<script>
import StandingsTable from "../tables/StandingsTable.vue";
// import { mapActions } from "vuex";
export default {
  components: {
    StandingsTable,
  },
  data() {
    return {
    };
  },
  async mounted() {
    var year = this.$route.query.year;
    var round = this.$route.query.round;
    var mode = this.$route.query.mode;
    if (!(Object.is(year, undefined) || isNaN(Number(year)))) {
      this.$store.commit(
        "Standings/updateYear",
        Number(this.$route.query.year)
      );
    }
    if (!(Object.is(round, undefined) || isNaN(Number(round)))) {
      this.$store.commit("Standings/updateRound", Number(round));
    }
    if (mode === "drivers" || mode === "teams") {
      this.$store.commit("Standings/updateMode", mode);
    }

    this.title = "Standings";
    await this.$store.dispatch("Standings/getNewStandings", {});

    this.isLoading = false;
  },
  methods: {},
};
</script>

<style scoped>
</style>