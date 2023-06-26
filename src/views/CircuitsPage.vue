<template>
  <!-- <v-container v-if="circuits" class="table-container">
    <v-row>
      <table class="circuit-table">
        <thead>
          <tr>
            <th v-for="header in tableHeaders" :key="header.key" @click="onSortTableClick(header)">
              {{ header.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in circuits" :key="c.id">
            <td>{{ c.name }}</td>
            <td>{{ c.country }}</td>
            <td>{{ c.location }}</td>
            <td>{{ c.alt }}</td>
          </tr>
        </tbody>
      </table>
    </v-row>
    <v-row>
      <v-col cols="9"></v-col>
      <v-col class="page-size-col">
        <label style="font-size: large; margin-right: 2%; " for="page-size">Page size</label>
        <select id="page-size" v-model="pageSize">
          <option value=10>10</option>
          <option value=25>25</option>
          <option value=50>50</option>
          <option value=100>100</option>
        </select>
      </v-col>
      <v-col>
        <v-icon icon="mdi-chevron-double-left" size="large" aria-hidden="false" class="pagination-icon"
          @click="page = 1" />
        <v-icon icon="mdi-chevron-left" size="large" aria-hidden="false" class="pagination-icon"
          @click="handlePageChange(-1)" />
        <v-icon icon="mdi-chevron-right" size="large" aria-hidden="false" class="pagination-icon"
          @click="handlePageChange(1)" />
        <v-icon icon="mdi-chevron-double-right" size="large" aria-hidden="false" class="pagination-icon"
          @click="setLastPage()" />
      </v-col>
      <v-col class=page-number-col>
        <span class="table-page-number">Page {{ page }}/{{ maxPage }} </span>
      </v-col>
    </v-row>
  </v-container>
  <div v-else>Loading...</div> -->
  <DataTable :items="store?.getCircuits" :headers="tableHeaders" />
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCircuitStore } from '../stores/circuits'
import useFetch from '../hooks/useFetch'
import { ref } from 'vue'
import { watch } from 'vue'

import DataTable from '../components/DataTable.vue'

const store = useCircuitStore()
const { setCircuits } = store
const { fetchData } = useFetch

const circuits = ref([])
const sortDirection = ref('asc')
const sortCol = ref({ key: 'name', type: 'string' })
const pageSize = ref(10)
const page = ref(1)
const maxPage = ref(1)
const tableHeaders = [
  {
    title: 'Name',
    type: 'string',
    sortable: true,
    key: 'name',
  },
  {
    title: 'Country',
    type: 'string',
    sortable: true,
    key: 'country',
  },
  {
    title: 'Location',
    type: 'string',
    sortable: false,
    key: 'location',
  },
  {
    title: 'Altitude (m)',
    type: 'int',
    sortable: true,
    key: 'alt',
  },
]

onMounted(async () => {
  const data = await fetchData('/api/circuits')
  setCircuits(data.items)
})

// watch(pageSize, () => {
//   maxPage.value = Math.ceil(store.getCircuits.value.length / pageSize.value)
//   sortTable()
// })

// watch(page, () => sortTable())

// watch(store.getCircuits, (value) => {
//   maxPage.value = Math.ceil(value.length / pageSize.value)
//   sortTable()
// })

// watch(sortCol, () => sortTable())
// watch(sortDirection, () => sortTable())

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


function sortTable(col) {
  if (!col) col = sortCol.value
  const circuitsFromStore = store.getCircuits
  console.log(store.getCircuits)
  const key = col.key
  let sortFunc
  if (col.type === 'string') {
    sortFunc = (a, b) => {
      if (a[key] > b[key]) return sortDirection.value === 'desc' ? -1 : 1
      else if (a[key] < b[key]) return sortDirection.value === 'desc' ? 1 : -1
      else return 0
    }
  }
  else {
    if (sortDirection.value === 'desc') {
      sortFunc = (a, b) => b[key] - a[key]
    }
    else {
      sortFunc = (a, b) => a[key] - b[key]
    }
  }

  const startIndex = (page.value - 1) * pageSize.value
  console.log(startIndex)

  const sorted = circuitsFromStore.sort(sortFunc).slice(startIndex, startIndex + pageSize.value)
  circuits.value = sorted
}
</script>

<style lang="css" scoped>
.table-container {
  width: 80%;
}

.circuit-table {
  width: 100%;
  border: 1px solid black;
  border-collapse: collapse;
  font-size: large;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 500;
  margin-left: auto;
  margin-right: auto;
}

.circuit-table tr {
  border: 1px solid black
}

.circuit-table tr:nth-child(even) {
  background-color: lightgrey;
}

.circuit-table tr:nth-child(odd) {
  background-color: white
}

.circuit-table th {
  border: 1px solid black;
  text-align: left;
  width: 30%;
}

.circuit-table td {
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

}

.table-page-number {
  border: 1px solid black;
  padding: 2px;
  font-size: large;
  font-family: Arial, Helvetica, sans-serif;
}
</style>