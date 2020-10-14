<template>
  <v-container>
    <h1 class="title">{{ getTitle }}</h1>
    <v-data-table
      :headers="getHeaders"
      :items="getData"
      item-key="Name"
      class="elevation-1"
      hide-default-footer
      disable-pagination
      @click:row="onRowClicked"
    >
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  props: {
    title: String,
    headers: Array,
    data: Array,
  },
  data() {
    return {
      Title: this.title,
      tableData: this.data,
      tableHeaders: this.headers,
    };
  },
  computed: {
    getData() {
      return this.data;
    },
    getHeaders() {
      return this.headers;
    },
    getTitle() {
      return this.title;
    },
  },
  methods: {
    onRowClicked(par1, par2) {
      console.log(par1);
      console.log(par2);
    },
  },
  mounted() {
    //console.log("Title:", this.Title);
    //console.log("Tabledata: ", this.tableData);
    //console.log("Table headers: ", this.tableHeaders);
  },
};
</script>

<style scoped>
.title {
  text-align: center;
}
</style>