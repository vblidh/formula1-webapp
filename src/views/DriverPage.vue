<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <v-card>
          <v-card-title>
            {{ chosenDriver.first_name }} {{ chosenDriver.last_name }} 
            <v-spacer></v-spacer> {{chosenDriver.number}}
          </v-card-title>
        </v-card>
      </v-col>
      <v-col>
        <v-autocomplete :items="drivers" value="id" :item-text="getItemText">
        </v-autocomplete>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    driverId: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      chosenDriver: {},
      drivers: [],
    };
  },
  methods: {
    getItemText(item) {
      return item.first_name + " " + item.last_name;
    },
  },

  computed: {
    text: (item) => item.first_name + " " + item.last_name,
  },
  async beforeMount() {
    var url = "/drivers";
    var data = await this.$store.dispatch("getDataFromAPI", { url: url });
    this.drivers = data.Drivers;
    this.chosenDriver = this.drivers.find(
      (driver) => driver.id == this.driverId
    );
  },
};
</script>

<style scoped>
</style>