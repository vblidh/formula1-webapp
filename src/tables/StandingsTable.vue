<template>
  <v-container>
    <v-card>
      <v-card-title
        >{{ this.title }} <v-spacer></v-spacer> {{ this.date }}</v-card-title
      >
      <v-card-subtitle>subtitle</v-card-subtitle>
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
        }
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
      }
  },
};
</script>

<style scoped>
</style>