<template>
  <v-container>
    <h1 class="title">{{this.Title}}</h1>
    <v-data-table
      :headers="tableHeaders"
      :items="tableData"
      item-key="Name"
      class="elevation-1"
      items-per-page="20"
      hide-default-footer
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
  methods: {
    onRowClicked(par1, par2) {
      console.log(par1);
      console.log(par2);
    },
  },
  mounted() {
    console.log("Title:", this.Title);
    console.log("Tabledata: ", this.tableData);
    console.log("Table headers: ", this.tableHeaders);
  },
  beforeMount() {
    console.log("Title:", this.Title);
    console.log("Tabledata: ", this.tableData);
    console.log("Table headers: ", this.tableHeaders);
  },
};
</script>

<style scoped>

.title {
    text-align: center;
}

</style>