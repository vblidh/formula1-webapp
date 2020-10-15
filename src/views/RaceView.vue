<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <v-col>
        <v-select
          hint="Choose a year"
          label="Season"
          :items="Seasons"
          v-model="Year"
          outlined
          @change="getRacesByYear"
        ></v-select>
      </v-col>
      <v-col cols="6">
        <v-select
          hint="Choose a circuit"
          label="Round"
          :items="Races"
          v-model="Round"
          outlined
        ></v-select>
      </v-col>
      <v-col>
        <v-select
          label="Session"
          :items="Sessions"
          v-model="ChosenSession"
          outlined
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
          <DataTable v-if="showTable" :headers="tableHeaders" :data="tableData">
          </DataTable>
        </v-card>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import DataTable from "@/tables/DataTable.vue";

export default {
  props: {
    year: {
      type: String,
    },
    round: {
      type: String,
    },
  },
  components: {
    DataTable,
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
      Seasons: [],
      ChosenSession: "",
      Sessions: ["Qualifying", "Race"],
    };
  },
  beforeMount() {
    this.getRacesByYear();
    this.getRaceResults();
    for (let i = 2020; i > 1949; i--) {
      this.Seasons.push({ text: String(i), value: i });
    }
  },
  computed: {
    getRaceName() {
      return this.RaceName;
    },
    getCircuit() {
      return this.Circuit;
    },
    getRaceDate() {
      return this.RaceDate;
    },
  },
  methods: {
    addResultToCache(newKey) {
      var cache = localStorage.getItem("RaceResults");
      var parsed;
      if (cache != null) {
        console.log("Updating race result cache with key", newKey);
        parsed = JSON.parse(cache);
        parsed[newKey] = this.data;
        localStorage.setItem("RaceResults", JSON.stringify(parsed));
      } else {
        console.log("Creating new cache of race results with key", newKey);
        parsed = {};
        parsed[newKey] = this.data;
        localStorage.setItem("RaceResults", JSON.stringify(parsed));
      }
    },
    getRacesByYear() {
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
        var url = this.Year + ".json";
        this.axios
          .get(url)
          .then((resp) => resp.data)
          .then((data) => {
            console.log("Year:", this.Year);
            console.log("New Races:", data);
            var races = data.MRData.RaceTable.Races;
            var tmp = [];
            for (let index = 0; index < races.length; index++) {
              var obj = {
                text: races[index].raceName,
                value: races[index].round,
              };
              tmp.push(obj);
            }
            this.Races = [];
            this.Races = Object.assign(this.Races, tmp);
            if (cachedRaces !== null) {
              var parsed = JSON.parse(cachedRaces);
              parsed[this.Year] = this.Races;
              console.log("Updating localstorage with this season races");
              localStorage.setItem("Races", JSON.stringify(parsed));
            } else {
              var toAdd = {};
              toAdd[this.Year] = this.Races;
              console.log("Creating new localstorage for races", toAdd);
              localStorage.setItem("Races", JSON.stringify(toAdd));
            }
          });
      }
    },
    getResults() {
      if (this.ChosenSession === "Race") {
        this.getRaceResults();
      }
      else {
        console.log("Getting qualification results");
      }
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
      var url = this.Year + "/" + this.Round + "/results.json";
      if (!cacheExists) {
        await this.axios
          .get(url)
          .then((resp) => resp.data)
          .then((data) => (this.data = data.MRData));
        this.addResultToCache(raceKey);
      }

      var results = this.data.RaceTable.Races[0].Results;
      var tmp = [];
      for (var i = 0; i < results.length; i++) {
        var driver = results[i].Driver;
        var name = driver.givenName + " " + driver.familyName;
        var pos = results[i].position;
        var constructor = results[i].Constructor.name;
        var time;
        var status = results[i].status;
        if (status === "Finished") {
          time = results[i].Time.time;
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
      this.RaceName = this.data.RaceTable.Races[0].raceName;
      this.Circuit = this.data.RaceTable.Races[0].Circuit.circuitName;
      this.RaceDate = this.data.RaceTable.Races[0].date;
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