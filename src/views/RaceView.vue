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
      default: "1",
    },
  },
  components: {
    RaceTable,
  },
  data() {
    return {
      showTable: false,
      data: {},
      tableData: [],
      tableHeaders: [],
      RaceName: "",
      Circuit: "",
      RaceDate: "",
      Year: this.year,
      Round: this.round,
      Races: [],
      ChosenSession: "",
      Sessions: ["Qualifying", "Race"],
    };
  },
  beforeMount() {
    if (!Object.is(this.year, undefined)) {
      this.$store.commit("Results/updateYear", this.year);
    }
    this.getResults();
    // this.getRacesByYear();
    // this.getRaceResults();
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
    async test() {
      try {
        var resp = await this.$store.dispatch("getDataFromAPI", {
          url: "results/race?year=2020&round=11",
        });
        console.log("Resp from store:", resp);
      } catch (error) {
        console.log(error);
      }
    },
    async changeChosenRace(round){
      this.$store.commit('Results/updateRound', Number(round));
      await this.$store.dispatch('Results/getNewResults', {});

    },
    async changeMode(mode){
      this.$store.commit('Results/updateMode', mode.toLowerCase());
      await this.$store.dispatch('Results/getNewResults', {});
    },
    addResultToCache(newKey, isRace = true) {
      var parsed;
      var item;
      if (isRace) item = "RaceResults";
      else item = "QualifyingResults";
      var cache = localStorage.getItem(item);
      if (cache != null) {
        console.log("Updating " + item + " cache with key", newKey);
        parsed = JSON.parse(cache);
        parsed[newKey] = this.data;
        localStorage.setItem(item, JSON.stringify(parsed));
      } else {
        console.log("Creating new cache of " + item + " with key", newKey);
        parsed = {};
        parsed[newKey] = this.data;
        localStorage.setItem(item, JSON.stringify(parsed));
      }
    },
    async getRacesByYear(year) {
      this.$store.dispatch("Results/getRacesInYear", { year });
      /*
      var cachedRaces = localStorage.getItem("Races");
      var isDataCached = false;
      var parsed;
      if (cachedRaces != null) {
        parsed = JSON.parse(cachedRaces);
        if (parsed[this.Year] != null) {
          console.log("Found cached race", parsed[this.Year]);
          this.Races = [];
          this.Races = Object.assign(this.Races, parsed[this.Year]);
          isDataCached = true;
        }
      }
      if (!isDataCached) {
        var url = "/races?year="+this.Year;
        var data = await this.$store.dispatch("getDataFromAPI", { url: url });
        console.log("Year:", this.Year);
        console.log("New Races:", data);
        var races = data.races;
        var tmp = [];
        for (let index = 0; index < races.length; index++) {
          var obj = {
            text: races[index].name,
            value: races[index].round,
          };
          tmp.push(obj);
        }
        this.Races = [];
        this.Races = Object.assign(this.Races, tmp);
        if (cachedRaces !== null) {
          parsed = JSON.parse(cachedRaces);
          parsed[this.Year] = this.Races;
          console.log("Updating localstorage with this season races");
          localStorage.setItem("Races", JSON.stringify(parsed));
        } else {
          var toAdd = {};
          toAdd[this.Year] = this.Races;
          console.log("Creating new localstorage for races", toAdd);
          localStorage.setItem("Races", JSON.stringify(toAdd));
        }
      }
       */
    },
    checkCache(isRace) {
      var cacheExists = false;
      var key = this.Year + "_" + this.Round;
      var parsed;
      if (isRace) {
        var cachedRaceResults = localStorage.getItem("RaceResults");
        if (cachedRaceResults != null) {
          parsed = JSON.parse(cachedRaceResults);
          if (parsed[key] != null) {
            this.data = parsed[key];
            console.log("Found cached raceresults with key", key);
            cacheExists = true;
          }
        }
      } else {
        var cachedQualifyingResults = localStorage.getItem("QualifyingResults");
        if (cachedQualifyingResults != null) {
          parsed = JSON.parse(cachedQualifyingResults);
          if (parsed[key] != null) {
            this.data = parsed[key];
            console.log("Found cached raceresults with key", key);
            cacheExists = true;
          }
        }
      }
      return cacheExists;
    },
    async getResults() {

      await this.$store.dispatch('Results/getNewResults', {});
      /*
      if (this.ChosenSession === "Race") {
        this.getRaceResults();
      } else {
        console.log("Getting qualification results");
        this.getQualiResults();
      }
      */
    },
    async getQualiResults() {
      this.tableData = [];
      var cacheExists = this.checkCache(false);
      if (!cacheExists) {
        var url =
          "/results/qualifying?year=" + this.Year + "&round=" + this.Round;
        var key = this.Year + "_" + this.Round;
        await this.axios
          .get(url)
          .then((resp) => resp.data)
          .then((data) => (this.data = data.qualifying_results[0]));
        console.log(this.data);
        this.addResultToCache(key, false);
      }
      console.log(this.data);
      var results = this.data.results;
      var tmp = [];
      for (var i = 0; i < results.length; i++) {
        var driver = results[i].driver;
        var name = driver.first_name + " " + driver.last_name;
        var pos = results[i].position;
        var constructor = results[i].team.name;
        var q2;
        var q3;
        var q1 = results[i].Q1;
        if (q1 == null) {
          q1 = q2 = q3 = "Did not qualify";
        } else {
          q2 = results[i].Q2;
          if (q2 == null) {
            q2 = q3 = "-";
          } else {
            q3 = results[i].Q3;
          }
        }
        var obj = {
          Position: pos,
          Name: name,
          Team: constructor,
          Q1: q1,
          Q2: q2,
          Q3: q3,
        };
        tmp.push(obj);
      }
      this.tableData = tmp;
      this.tableHeaders = [
        {
          text: "Position",
          value: "Position",
          divider: true,
          align: "center",
          width: "4",
        },
        { text: "Name", value: "Name", divider: true, align: "center" },
        { text: "Team", value: "Team", divider: true, align: "center" },
        { text: "Q1", value: "Q1", divider: true, align: "center" },
        { text: "Q2", value: "Q2", divider: true, align: "center" },
        { text: "Q3", value: "Q3", divider: true, align: "center" },
      ];
      this.RaceName = this.data.race.name;
      this.Circuit = this.data.race.circuit.name;
      this.RaceDate = this.data.race.date;
      this.showTable = true;
    },
    async getRaceResults() {
      this.tableData = [];
      var cacheExists = false;
      var cachedRaceResults = localStorage.getItem("RaceResults");
      var raceKey = this.Year + "_" + this.Round;

      if (cachedRaceResults != null) {
        var parsed = JSON.parse(cachedRaceResults);
        if (parsed[raceKey] != null) {
          this.data = parsed[raceKey];
          console.log("Found cached raceresults with key", raceKey);
          cacheExists = true;
        }
      }
      var url;
      if (this.Year && this.Round) {
        url = "/results/race?year=" + this.Year + "&round=" + this.Round;
      } else if (this.Year) {
        url = "results/race/?year=" + this.Year;
      } else {
        url = "/results/race";
      }
      if (!cacheExists) {
        // TODO: Change to store dispatch
        await this.axios
          .get(url)
          .then((resp) => resp.data)
          .then((data) => (this.data = data.race_results[0]));
        this.addResultToCache(raceKey);
      }
      var results = this.data.results;
      var tmp = [];
      for (var i = 0; i < results.length; i++) {
        var driver = results[i].driver;
        var name = driver.first_name + " " + driver.last_name;
        var pos = results[i].position_order;
        var constructor = results[i].team.name;
        var time;
        var status = results[i].status;
        if (status === "Finished") {
          time = results[i].time;
        } else if (status.startsWith("+")) {
          time = status;
        } else {
          time = "DNF (" + status + ")";
        }
        var points = results[i].points;
        var obj = {
          Position: pos,
          Name: name,
          Team: constructor,
          Time: time,
          Points: points,
        };
        tmp.push(obj);
      }
      this.tableData = tmp;

      this.tableHeaders = [
        {
          text: "Position",
          value: "Position",
          divider: true,
          align: "center",
          width: "4",
        },
        { text: "Name", value: "Name", divider: true, align: "center" },
        { text: "Team", value: "Team", divider: true, align: "center" },
        { text: "Time", value: "Time", divider: true, align: "center" },
        { text: "Points", value: "Points", divider: true, align: "center" },
      ];
      this.RaceName = this.data.race.name;
      this.Circuit = this.data.race.circuit.name;
      this.RaceDate = this.data.race.date;
      this.showTable = true;
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