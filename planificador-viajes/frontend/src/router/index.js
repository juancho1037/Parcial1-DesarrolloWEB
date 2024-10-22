import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Trips from '../views/Trips.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/trips',
    name: 'trips',
    component: Trips,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token');

  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
})

export default router