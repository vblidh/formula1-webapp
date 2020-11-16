<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <v-card>
          <v-card-title>
            {{ getChosen.first_name }} {{ getChosen.last_name }}
            <v-spacer></v-spacer> {{ getChosen.number }}
          </v-card-title>
          <v-card-text>
            Wins: {{ getWins }} <br />
            Podiums: {{ getPodiums }} <br />
            Pole positions:{{ getPoles }} (May be incorrect for older drivers)
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-autocomplete
          :items="getDrivers"
          item-value="id"
          :item-text="getItemText"
          @change="selectDriver"
        >
        </v-autocomplete>
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
    };
  },
  methods: {
    getItemText(item) {
      return item.first_name + " " + item.last_name;
    },
    selectDriver(id) {
      this.$store.dispatch("Drivers/setChosenDriver", { id });
      this.$store.dispatch("Drivers/getDriverStats");
    },
  },
  computed: {
    text: (item) => item.first_name + " " + item.last_name,
    ...mapGetters({
      getDrivers: "Drivers/DriverList",
      getChosen: "Drivers/ChosenDriver",
      getPodiums: "Drivers/Podiums",
      getWins: "Drivers/Wins",
      getPoles: "Drivers/Poles",
    }),
  },
  async beforeMount() {
    await this.$store.dispatch("Drivers/getDrivers");
    if (
      !(Object.is(this.driverId, undefined) || isNaN(Number(this.driverId)))
    ) {
      this.selectDriver(Number(this.driverId));
      this.$store.dispatch("Drivers/getDriverStats");
      console.log(this.getChosen);
    }
  },
};
</script>

<style scoped>
</style>