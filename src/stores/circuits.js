import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCircuitStore = defineStore('circuits', () => {
  const circuits = ref([])
  const getCircuits = computed(() => circuits.value)
  const getCircuit = computed(id => circuits.value.find(c => c.id == id))
  const setCircuits = function (newCircuits) {
    circuits.value = newCircuits
  }

  return { circuits, getCircuit, getCircuits, setCircuits }
})
