<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <v-virtual-scroll
          height="670"
          :items="getDrivers"
          item-height="40"
          bench="10"
        >
          <template v-slot:default="{ item }">
            <v-list-item :key="item.id" @click="onClickVirtual(item)">
              <v-list-item-content>
                <v-list-item-title>
                  <h4>
                    {{ item.forename }}
                    {{ item.surname }}
                  </h4>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-col>
      <v-col>
        <v-row class="hoho">
          <v-col cols="8">
            <v-card>
              <v-card-title>
                {{ getChosen.first_name }} {{ getChosen.last_name }}
                <v-spacer></v-spacer> {{ getChosen.number }}
              </v-card-title>
              <v-card-text>
                Races in total: {{ getTotalRaces }} <br />
                Podiums: {{ getPodiums }} <br />
                Wins: {{ getWins }} <br />
                Pole positions: {{ getPoles }} (May be incorrect for older
                drivers)
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
              prepend-icon="mdi-racing-helmet"
              append-icon=""
              placeholder="Search for a driver"
              :menu-props="{ maxHeight: 150 }"
            >
            </v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card color="red accent-4">
              <v-card-title>Season results</v-card-title>
              <v-container>
                <v-data-table
                  :items="getSeasonResults"
                  :headers="seasonResultTableHeaders"
                  :items-per-page="seasonResultsPageSize"
                  disable-sort
                  loading-text="Retrieving driver results..."
                  :loading="isRetreivingSeasonResults"
                >
                </v-data-table>
              </v-container>
            </v-card>
          </v-col>
          <v-col>
            <v-card color="red accent-4">
              <v-card-title>Race results</v-card-title>
              <v-container>
                <v-data-table
                  :items="getLastResults"
                  :headers="raceResultTableHeaders"
                  :server-items-length="getTotalRaces"
                  :page="getPage"
                  :items-per-page="getPageSize"
                  @update:items-per-page="onNewPageSize"
                  @update:page="onNewPage"
                  disable-sort
                  fixed-header
                  loading-text="Retrieving driver results..."
                  :loading="isRetreivingRaceResults"
                >
                </v-data-table>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <iframe width="100%" height="550" :src="getChosen.wiki_url" />
      </v-col>
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
      seasonResultsPageSize: 5,
      raceResultTableHeaders: [
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
      seasonResultTableHeaders: [
        { text: "Year", value: "Year", align: "center", divider: true },
        { text: "Team", value: "Team", align: "center", divider: true },
        { text: "Wins", value: "Wins", align: "center", divider: true },
        { text: "Points", value: "Points", align: "center", divider: true },
        { text: "Position", value: "Pos", align: "center", divider: true },
      ],
    };
  },
  methods: {
    getItemText(item) {
      return item.forename+ " " + item.surname;
    },
    selectDriver(id) {
      this.$store.dispatch("Drivers/setChosenDriver", { id });
      this.$store.dispatch("Drivers/getDriverStats");
      this.$store.commit("Drivers/updateCurrentPage", 1);
      this.$store.dispatch("Drivers/getLastRaces");
      this.$store.dispatch("Drivers/getSeasonResults");
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
      this.$store.dispatch("Drivers/getSeasonResults");
    },
  },
  computed: {
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
      getSeasonResults: "Drivers/SeasonResults",
      isRetreivingRaceResults: "Drivers/IsLoadingRaceResults",
      isRetreivingSeasonResults: "Drivers/IsLoadingSeasonResults",
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