import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Trips from '../views/Trips.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/trips',
    name: 'Trips',
    component: Trips
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router