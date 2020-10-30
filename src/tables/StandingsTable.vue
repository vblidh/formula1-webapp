<template>
  <v-container>
    <v-card>
      <v-card-title
        ><v-spacer></v-spacer> {{ this.title }} <v-spacer></v-spacer></v-card-title
      >
      <v-card-subtitle>subtitle</v-card-subtitle>
      <v-card-actions>
        <v-slider
        hint="Choose which round of season to display standings from" 
        label="Round"
        min="0"
        :max="getRounds"
        color="red accent-4"
        background-color="white"
        hide-details="auto"
        thumb-label="always"
        @end="onChoseRound"
        ></v-slider>
      </v-card-actions>
      <v-data-table
        :items="getItems"
        :headers="getHeaders"
        disable-sort
        disable-pagination
        :loading="isLoading"
        hide-default-footer
        loading-text="Loading standings..."
        no-data-text="No standings found for those parameters"
      >
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
    props: {
        headers: {
            type: Array,
        },
        items: {
            type: Array,
        },
        title: {
            type: String
        },
        date: {
            type: String
        },
        isLoading: {
            type: Boolean
        },
        rounds: {
          type: Number
        },
    },
  data() {
    return {
    };
  },
  computed: {
      getItems() {
          return this.items;
      },
      getHeaders() {
          return this.headers;
      },
      getRounds() {
        return this.rounds;
      }
  },
  methods: {
    onChoseRound(value) {
      console.log(value);
    }
  },
};
</script>

<style scoped>
</style>