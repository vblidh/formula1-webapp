<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-virtual-scroll :items="getCircuits" :item-height="40" height="300">
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
        <v-row>

        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      key: "value",
    };
  },
  computed: {
    ...mapGetters({
      getCircuits: "Circuits/Circuits",
    }),
  },
  async beforeMount() {
    await this.$store.dispatch("Circuits/getCircuits");
    console.log(this.getCircuits);
  },
  methods: {
      selectCircuit(circuit) {
          console.log(circuit);
      }
  },
};
</script>

<style scoped>
</style>