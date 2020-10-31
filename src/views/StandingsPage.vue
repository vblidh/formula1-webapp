<template>
  <v-container>
    <Table
      :title="title"
      :isLoading="isLoading"
      :rounds="currentYearRounds"
    ></Table>
  </v-container>
</template> 

<script>
import StandingsTable from "../tables/StandingsTable.vue";
// import { mapActions } from "vuex";
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
  async mounted() {
    var year = this.$route.query.year;
    var round =this.$route.query.round;
    var mode = this.$route.query.mode;
    if (!(Object.is(year, undefined) || isNaN(Number(year)))) {
      this.$store.commit('updateYear', Number(this.$route.query.year))
    }
     if (!(Object.is(round, undefined) || isNaN(Number(round)))){
       this.$store.commit('updateRound', Number(round))
     }
    if (mode === "drivers" || mode === "teams"){
      this.$store.commit('updateMode', mode);
    }


    this.title = "Standings";
    //this.$store.commit('updateMode', "drivers");
    await this.$store.dispatch("getNewStandings", {});

    // var url = "/standings/";
    // if (this.year === "latest") {
    //   url += this.mode + "/latest";
    // } else {
    //   url += this.mode + "?year=" + this.year + "&round=" + this.round;
    // }
    // const dataTask = this.$store.dispatch("getDataFromAPI", { url });

    // this.data = await dataTask;
    // var tmp = [];
    // var arr;

    // if (this.mode === "drivers") {
    //   arr = this.data.driver_standings;
    //   this.title = "F1 World Driver Championship standings";
    // } else {
    //   arr = this.data.team_standings;
    //   this.title = "F1 World Constructor Championship standings";
    // }
    // for (var i = 0; i < arr.length; i++) {
    //   var ds = arr[i];
    //   var driverName = ds.driver.first_name + " " + ds.driver.last_name;
    //   var nationality = ds.driver.nationality;
    //   var number = ds.driver.number;
    //   var points = ds.points;
    //   var wins = ds.wins;
    //   var position = ds.position;
    //   var obj = {
    //     Position: position,
    //     Name: driverName,
    //     Number: number,
    //     Nationality: nationality,
    //     Points: points,
    //     Wins: wins,
    //   };
    //   tmp.push(obj);
    // }
    // console.log(tmp);
    // this.standings = tmp;
    // this.headers = [
    //   {
    //     text: "Position",
    //     value: "Position",
    //     divider: true,
    //     align: "center",
    //     width: "4",
    //   },
    //   { text: "Name", value: "Name", divider: true, align: "center" },
    //   {
    //     text: "Number",
    //     value: "Number",
    //     divider: true,
    //     align: "center",
    //     width: "4",
    //   },
    //   {
    //     text: "Nationality",
    //     value: "Nationality",
    //     divider: true,
    //     align: "center",
    //   },
    //   { text: "Points", value: "Points", divider: true, align: "center" },
    //   { text: "Wins (season)", value: "Wins", divider: true, align: "center", width: "5" },
    // ];

    //this.round = this.data.race.round;
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
    // ...mapActions({
    //   getData: 'StandingsModule/getNewStandings',
    // })
  },
};
</script>

<style scoped>
</style>