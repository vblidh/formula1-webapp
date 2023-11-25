
<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  items: Array,
  headers: Array,
  hidePagination: Boolean
})

const pageSizes = [10, 25, 50, 100]
const sortDirection = ref('asc')
const sortCol = ref({ key: 'name', type: 'string' })
const pageSize = ref(25)
const page = ref(1)

function toggleSortDirection() {
  sortDirection.value = sortDirection.value == 'asc' ? 'desc' : 'asc'
}

function onSortTableClick(col) {
  if (sortCol.value.key === col.key) {
    toggleSortDirection()
  }
  else {
    sortCol.value = col
  }
}

function handlePageChange(value) {
  const newPage = page.value + value
  if (newPage <= 0 || newPage > maxPage.value) return
  page.value = newPage
}

function setLastPage() {
  page.value = maxPage.value
}

const maxPage = computed(() => Math.ceil(props.items.length / pageSize.value))

const sortedTable = computed(() => {
  let col = sortCol.value
  const key = col.key

  const sortFunc = (a, b) => {
    if (a[key] > b[key]) return sortDirection.value === 'desc' ? -1 : 1
    else if (a[key] < b[key]) return sortDirection.value === 'desc' ? 1 : -1
    else return 0
  }

  const startIndex = (page.value - 1) * pageSize.value
  return props.items.sort(sortFunc).slice(startIndex, startIndex + pageSize.value)
})

</script>


<template>
  <v-container fluid v-if="items && items.length > 0" class="table-container">
    <v-row>
      <table class="f1-data-table">
        <thead>
          <tr>
            <th v-for="header in headers" :key="header.key" @click="onSortTableClick(header)">
              {{ header.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in sortedTable" :key="item.id">
            <td v-for="header in headers">{{ header.renderValue ? header.renderValue(item) : item[header.key] }}</td>
          </tr>
        </tbody>
      </table>
    </v-row>
    <v-row v-show="!hidePagination">
      <v-col></v-col>
      <v-col cols="2" class="page-size-col">
        <!-- <v-select label="Page size" :items="[25, 50, 100]" variant="solo"></v-select> -->
        <label style="font-size: large; margin-right: 2%; " for="page-size">Page size</label>
        <select id="page-size" v-model="pageSize">
          <option v-for="size in pageSizes" :value="size">{{ size }}</option>
        </select>
      </v-col>
      <v-col cols="2">
        <v-icon icon="mdi-chevron-double-left" size="large" aria-hidden="false" class="pagination-icon"
          @click="page = 1" />
        <v-icon icon="mdi-chevron-left" size="large" aria-hidden="false" class="pagination-icon"
          @click="handlePageChange(-1)" />
        <v-icon icon="mdi-chevron-right" size="large" aria-hidden="false" class="pagination-icon"
          @click="handlePageChange(1)" />
        <v-icon icon="mdi-chevron-double-right" size="large" aria-hidden="false" class="pagination-icon"
          @click="setLastPage()" />
      </v-col>
      <v-col cols="2" class=page-number-col>
        <span class="table-page-number">Page {{ page }}/{{ maxPage }} </span>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="css" scoped>
.table-container {
  width: 80%;
}

.f1-data-table {
  width: 100%;
  border: 1px solid black;
  border-collapse: collapse;
  font-size: large;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 500;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 10px 8px 10px 5px #999;
}

.f1-data-table tr {
  border: 1px solid black
}

.f1-data-table tr:nth-child(even) {
  background-color: lightgrey;
}

.f1-data-table tr:nth-child(odd) {
  background-color: white
}

.f1-data-table th {
  border: 1px solid black;
  text-align: left;
  width: 30%;
}

.f1-data-table td {
  border: 1px solid black;
  line-height: 200%;
}

#page-size {
  font-size: large;
}

.pagination-icon:hover {
  background-color: grey;
}

.page-size-col {
  margin-top: 2px;
}

.page-number-col {
  margin-top: 4px;
  text-align: end;
}

.table-page-number {
  border: 1px solid black;
  padding: 2px;
  font-size: large;
  font-family: Arial, Helvetica, sans-serif;
}
</style>