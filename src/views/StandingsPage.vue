<template>
  <v-container>
    <Table
      title="Some fine title"
      :items="standings"
      :headers="headers"
      isLoadings="false"
    ></Table>
  </v-container>
</template> 

<script>
import StandingsTable from "../tables/StandingsTable.vue";


export default {
    components: {
        Table : StandingsTable,
    },
  data() {
    return {
      data: {},
      year: "0",
      round: "0",
      headers : [{ text: "Position", value: "Pos"}, {text: "Driver", value: "Name" }],
      standings :[{Pos: 1, Name: "Name1"}, {Pos: 2, Name:"Name2"}],
    };
  },
  beforeMount() {
    this.year = Object.is(this.$route.query.year, undefined)
      ? "latest"
      : this.$route.query.year;
    this.round = Object.is(this.$route.query.round, undefined)
      ? 0
      : this.$route.query.round;
  },
  computed: {
    name() {
      return this.data;
    },
  },
  methods: {
    method() {},
  },
};
</script>

<style scoped>
</style>