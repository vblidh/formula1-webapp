<template>
  <DataTable :items="store?.getCircuits" :headers="tableHeaders" />
</template>

<script setup>
import { onMounted } from 'vue'
import { useCircuitStore } from '../stores/circuits'
import useFetch from '../hooks/useFetch'

import DataTable from '../components/DataTable.vue'

const store = useCircuitStore()
const { setCircuits } = store
const { fetchData } = useFetch

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