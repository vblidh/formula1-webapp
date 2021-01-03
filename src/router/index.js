import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import RaceView from '../views/RaceView.vue';
import DriverPage from '../views/DriverPage.vue';
import StandingsPage from '../views/StandingsPage.vue';
// import CircuitPage from '../views/CircuitPage.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/races/:year?/:round?/:raceId?',
    name: "Races",
    component: RaceView,
    props: true
  },
  {
    path: '/drivers/:driverId?',
    name: 'Drivers',
    component: DriverPage,
    props: true
  },
  {
    path: '/standings',
    name: 'Standings',
    component: StandingsPage,
  },
  {
    path: '/circuits/:circuitId?',
    name: 'Circuits',
    component: () => import('../views/CircuitPage.vue'),
    props: true,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
