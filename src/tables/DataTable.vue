<template>
  <v-container>
    <v-data-table
      :headers="getHeaders"
      :items="getData"
      item-key="Name"
      class="elevation-1"
      hide-default-footer
      disable-pagination
      disable-sort
      @click:row="onRowClicked"
    >
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  props: {
    headers: Array,
    data: Array,
  },
  data() {
    return {

    };
  },
  computed: {
    getData() {
      return this.data;
    },
    getHeaders() {
      return this.headers;
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
.elevation-1 {
  background: whitesmoke !important;
}
</style>