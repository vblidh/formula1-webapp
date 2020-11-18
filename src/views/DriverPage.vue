<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-virtual-scroll
          height="150"
          :items="getDrivers"
          item-height="40"
          bench="10"
        >
          <template v-slot:default="{ item }">
            <v-list-item :key="item.id" @click="onClickVirtual(item)">
              <v-list-item-content>
                <v-list-item-title>
                  <h4>
                    {{ item.first_name }}
                    {{ item.last_name }}
                  </h4>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-col>
      <v-col cols="6">
        <v-card>
          <v-card-title>
            {{ getChosen.first_name }} {{ getChosen.last_name }}
            <v-spacer></v-spacer> {{ getChosen.number }}
          </v-card-title>
          <v-card-text>
            Races in total: {{ getTotalRaces }} <br />
            Podiums: {{ getPodiums }} <br />
            Wins: {{ getWins }} <br />
            Pole positions: {{ getPoles }} (May be incorrect for older drivers)
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-autocomplete
          :items="getDrivers"
          :item-text="getItemText"
          item-value="id"
          @change="selectDriver"
          outlined
          dense
          clearable
          filled
          append-icon="mdi-racing-helmet"
          placeholder="Search for a driver"
        >
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-row>
      <v-col></v-col>
      <v-col></v-col>
      <v-col cols="6">
        <v-card color="red accent-4">
          <v-card-title>Latest results</v-card-title>
          <v-container>
            <v-data-table
              :items="getLastResults"
              :headers="tableHeaders"
              :server-items-length="getTotalRaces"
              :page="getPage"
              :items-per-page="getPageSize"
              @update:items-per-page="onNewPageSize"
              @update:page="onNewPage"
              disable-sort
              fixed-header
            >
            </v-data-table>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col></v-col>
      <v-col cols="10">
        <iframe width="100%" height="700" :src="getChosen.wiki_url" />
      </v-col>
      <v-col></v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    driverId: {
      type: String,
    },
  },
  data() {
    return {
      tableHeaders: [
        { text: "Race", value: "Race", align: "center", divider: true },
        { text: "Date", value: "Date", align: "center", divider: true },
        {
          text: "Starting grid",
          value: "Grid",
          align: "center",
          divider: true,
        },
        { text: "Position", value: "Pos", align: "center", divider: true },
      ],
    };
  },
  methods: {
    getItemText(item) {
      return item.first_name + " " + item.last_name;
    },
    selectDriver(id) {
      this.$store.dispatch("Drivers/setChosenDriver", { id });
      this.$store.dispatch("Drivers/getDriverStats");
      this.$store.commit("Drivers/updateCurrentPage", 1);
      this.$store.dispatch("Drivers/getLastRaces");
    },
    onNewPageSize(size) {
      this.$store.commit("Drivers/updatePageSize", size);
      this.$store.dispatch("Drivers/getLastRaces");
    },
    onNewPage(page) {
      this.$store.commit("Drivers/updateCurrentPage", page);
      this.$store.dispatch("Drivers/getLastRaces");
    },
    onClickVirtual(driver) {
      this.$store.commit("Drivers/updateChosen", driver);
      this.$store.commit("Drivers/updateCurrentPage", 1);
      this.$store.dispatch("Drivers/getDriverStats");
      this.$store.dispatch("Drivers/getLastRaces");
    },
  },
  computed: {
    text: (item) => item.first_name + " " + item.last_name,
    ...mapGetters({
      getDrivers: "Drivers/DriverList",
      getChosen: "Drivers/ChosenDriver",
      getPageSize: "Drivers/PageSize",
      getPage: "Drivers/CurrentPage",
      getPodiums: "Drivers/Podiums",
      getWins: "Drivers/Wins",
      getPoles: "Drivers/Poles",
      getLastResults: "Drivers/LastResults",
      getTotalRaces: "Drivers/TotalRaces",
    }),
  },
  async beforeMount() {
    await this.$store.dispatch("Drivers/getDrivers");
    if (
      !(Object.is(this.driverId, undefined) || isNaN(Number(this.driverId)))
    ) {
      this.selectDriver(Number(this.driverId));
      this.$store.dispatch("Drivers/getDriverStats");
      this.$store.dispatch("Drivers/getLastRaces");
    }
  },
};
</script>

<style scoped>
</style>