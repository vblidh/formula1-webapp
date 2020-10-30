<template>
  <v-container>
    <Table
      :title="title"
      :items="standings"
      :headers="headers"
      :isLoading="isLoading"
      :rounds="currentYearRounds"
    ></Table>
  </v-container>
</template> 

<script>
import StandingsTable from "../tables/StandingsTable.vue";

export default {
  components: {
    Table: StandingsTable,
  },
  data() {
    return {
      data: {},
      year: "0",
      round: "0",
      mode: "",
      headers: [],
      standings: [],
      isLoading: true,
      title: "",
      currentYearRounds: 0,
    };
  },
  async beforeMount() {
    this.year = Object.is(this.$route.query.year, undefined)
      ? "latest"
      : this.$route.query.year;
    this.round = Object.is(this.$route.query.round, undefined)
      ? ""
      : this.$route.query.round;
    this.mode = Object.is(this.$route.query.mode, undefined)
      ? "drivers"
      : this.$route.query.mode;

    var url = "/standings/";
    if (this.year === "latest") {
      url += this.mode + "/latest";
    } else {
      url += this.mode + "?year=" + this.year + "&round=" + this.round;
    }
    const dataTask = this.$store.dispatch("getDataFromAPI", { url });
    const roundTask = this.getRoundAmount();

    this.data = await dataTask;
    var tmp = [];
    var arr;

    if (this.mode === "drivers") {
      arr = this.data.driver_standings;
      this.title = "F1 World Driver Championship standings";
    } else {
      arr = this.data.team_standings;
      this.title = "F1 World Constructor Championship standings";
    }
    for (var i = 0; i < arr.length; i++) {
      var ds = arr[i];
      var driverName = ds.driver.first_name + " " + ds.driver.last_name;
      var nationality = ds.driver.nationality;
      var number = ds.driver.number;
      var points = ds.points;
      var wins = ds.wins;
      var position = ds.position;
      var obj = {
        Position: position,
        Name: driverName,
        Number: number,
        Nationality: nationality,
        Points: points,
        Wins: wins,
      };
      tmp.push(obj);
    }
    console.log(tmp);
    this.standings = tmp;
    this.headers = [
      {
        text: "Position",
        value: "Position",
        divider: true,
        align: "center",
        width: "4",
      },
      { text: "Name", value: "Name", divider: true, align: "center" },
      {
        text: "Number",
        value: "Number",
        divider: true,
        align: "center",
        width: "4",
      },
      {
        text: "Nationality",
        value: "Nationality",
        divider: true,
        align: "center",
      },
      { text: "Points", value: "Points", divider: true, align: "center" },
      { text: "Wins (season)", value: "Wins", divider: true, align: "center", width: "5" },
    ];

    this.round = this.data.race.round;
    this.currentYearRounds = await roundTask;
    this.isLoading = false;
  },
  computed: {
    name() {
      return this.data;
    },
  },
  methods: {
    async getRoundAmount() {
      var url = "/races/rounds?year=" + this.year;
      return this.$store.dispatch("getDataFromAPI", { url: url });
    },
  },
};
</script>

<style scoped>
</style>