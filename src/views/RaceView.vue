<template>
  <v-container>
    <v-row>
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
      <v-col cols="8">
        <v-select
          hint="Choose a circuit"
          label="Round"
          :items="Races"
          v-model="Round"
          outlined
          @change="getRaceResults"
        ></v-select>
      </v-col>
    </v-row>
    <v-card color="red accent-4">
      <v-card-title class="title">
        {{ getRaceName }} <v-spacer></v-spacer> {{ getRaceDate }}</v-card-title
      >
      <v-card-subtitle>{{ getCircuit }}</v-card-subtitle>
      <DataTable v-if="showTable" :headers="tableHeaders" :data="tableData">
      </DataTable>
    </v-card>
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
    getRacesByYear() {
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
        });
    },
    getRaceResults() {
      var url = this.Year + "/" + this.Round + "/results.json";
      this.tableData = [];
      this.axios
        .get(url)
        .then((resp) => resp.data)
        .then((data) => (this.data = data.MRData))
        .finally(() => {
          //console.log("Race data:", this.data);
          var results = this.data.RaceTable.Races[0].Results;
          var tmp = [];
          for (var i = 0; i < results.length; i++) {
            //console.log(results[i]);
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
            //console.log(obj);
            tmp.push(obj);
          }
          //this.tableData = Object.assign(this.tableData, tmp);
          this.tableData = tmp;
          console.log("Tabledata after: ", this.tableData);

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
          console.log(this.RaceName);
          this.showTable = true;
        });
    },
  },
};
</script>
<style scoped>
.v-card__title {
  color: white !important;
}
.v-card__subtitle {
  color:white !important;
}
</style>