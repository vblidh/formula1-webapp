<template>
  <div class="home">
    <RaceTable
      v-if="gotData"
      :title="this.Title"
      :headers="this.tableHeaders"
      :data="this.tableData"
    ></RaceTable>
    <v-btn @click="getData">Collect Data</v-btn>
  </div>
</template>

<script>
// @ is an alias to /src
import RaceTable from "@/tables/RaceTable.vue";
export default {
  name: "Home",
  components: {
    RaceTable,
  },
  data() {
    return {
      gotData: false,
      Title: "",
      data: {},
      tableData: [],
      tableHeaders: [],
    };
  },
  methods: {
    getData() {
      this.data = {};
      this.tableData = [];
      this.axios
        .get("current/last/results.json")
        .then((resp) => resp.data)
        .then((data) => (this.data = data.MRData))
        .finally(() => {
          console.log("Data: ", this.data);
          var results = this.data.RaceTable.Races[0].Results;
          for (var i = 0; i < results.length; i++) {
            //console.log(results[i]);
            var driver = results[i].Driver;
            var name = driver.givenName + " " + driver.familyName;
            var pos = results[i].position;
            var constructor = results[i].Constructor.name;
            var time;
            if (results[i].status == "Finished") {
              time = results[i].Time.time;
            } else {
              time = "DNF";
            }
            var points = results[i].points;
            var obj = {
              Position: pos,
              Name: name,
              Team: constructor,
              Time: time,
              Points: points,
            };
            console.log(obj);
            this.tableData.push(obj);
          }
          console.log(this.tableData);
          this.tableHeaders = [
            { text: "Position", value: "Position" },
            { text: "Name", value: "Name" },
            { text: "Team", value: "Team" },
            { text: "Time", value: "Time" },
            { text: "Points", value: "Points" },
          ];
          this.Title = this.data.RaceTable.Races[0].raceName;
          this.gotData = true;
          console.log(this.gotData);
        });
    },
  },
};
</script>
