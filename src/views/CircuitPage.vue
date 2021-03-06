<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-virtual-scroll :items="getCircuits" :item-height="40" height="430">
          <template v-slot:default="{ item }">
            <v-list-item :key="item.id" @click="selectCircuit(item)">
              <v-list-item-content>
                <v-list-item-title>
                  <h4>{{ item.name }}</h4>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-col>
      <v-col>
        <v-card color="red accent-4">
          <v-card-title class="text-h3">
            <v-spacer />
            Winners over the years
            <v-spacer />
          </v-card-title>
          <v-card-subtitle class="text-h5">
              {{ CircuitName }}
            <v-spacer> </v-spacer>
            {{ CircuitCity }} - {{ CircuitCountry }}
          </v-card-subtitle>

          <v-divider></v-divider>
          <v-data-table
            :items="getRaces"
            :headers="getHeaders"
            disable-filtering
            :server-items-length="getTotalRaces"
            @update:page="onNewPage"
            @update:items-per-page="onNewPageSize"
            :loading="getIsLoading"
            loader-height="10"
            loading-text="Getting races..."
            no-data-text="No circuit chosen"
            item-key="year"
            @click:row="onRowClicked"
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <iframe :src="getCircuitUrl" width="100%" height="550" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    circuitId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      getCircuits: "Circuits/Circuits",
      getChosenCircuit: "Circuits/ChosenCircuit",
      getCircuitUrl: "Circuits/ChosenCircuitLink",
      getRaces: "Circuits/RaceList",
      getHeaders: "Circuits/Headers",
      getTotalRaces: "Circuits/TotalRaces",
      getIsLoading: "Circuits/IsRequestPending",
    }),
    CircuitName: function () {
      var circuit = this.getChosenCircuit;
      return Object.is(circuit, undefined) ? "" : circuit.name;
    },
    CircuitCountry: function () {
      var circuit = this.getChosenCircuit;
      return Object.is(circuit, undefined) ? "" : circuit.country;
    },
    CircuitCity: function () {
      var circuit = this.getChosenCircuit;
      return Object.is(circuit, undefined) ? "" : circuit.city;
    },
    CircuitId: function () {
      var circuit = this.getChosenCircuit;
      return Object.is(circuit, undefined) ? "" : circuit.id;
    },
  },
  async beforeMount() {
    await this.$store.dispatch("Circuits/getCircuits");
    console.log(this.getCircuits);
    if (this.circuitId) {
      var chosen = this.getCircuits.find(
        (circuit) => circuit.id == this.circuitId
      );
      console.log("Circuit from prop:", chosen);
      this.$store.dispatch("Circuits/getCircuitRaces", { circuit: chosen });
    }
  },
  methods: {
    selectCircuit(circuit) {
      this.$store.commit("Circuits/updatePage", 1);
      this.$store.dispatch("Circuits/getCircuitRaces", { circuit });
    },
    onNewPage(page) {
      this.$store.commit("Circuits/updatePage", page);
      this.$store.dispatch("Circuits/getCircuitRaces");
    },
    onNewPageSize(pageSize) {
      this.$store.commit("Circuits/updatePageSize", pageSize);
      this.$store.dispatch("Circuits/getCircuitRaces");
    },
    onRowClicked(row) {
      this.$router.push({ name: "Races", params: { raceId: row.raceId } });
    },
  },
};
</script>

<style scoped>
</style>