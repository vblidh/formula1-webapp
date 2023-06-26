import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/races/:raceId?',
      name: "Races",
      component: () => import('../views/RaceView.vue'),
      props: true
    },
    {
      path: '/drivers/:driverId?',
      name: 'Drivers',
      component: () => import('../views/DriverPage.vue'),
      props: true
    },
    {
      path: '/standings',
      name: 'Standings',
      component: () => import('../views/StandingsPage.vue'),
    },
    {
      path: '/circuits/:circuitId?',
      name: 'Circuits',
      component: () => import('../views/CircuitsPage.vue'),
      props: true,
    },
  ]
})

export default router
