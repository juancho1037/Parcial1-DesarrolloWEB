import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue'        // Cambiado de views a components
import Register from '../components/Register.vue'  // Cambiado de views a components
import Trips from '../views/Trips.vue'
import Explore from '../views/Explore.vue'
import Profile from '../views/Profile.vue'
import TripDetails from '../components/TripDetails.vue' // Cambiado de views a components

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'Inicio',
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: 'Iniciar Sesión',
      requiresAuth: false,
      hideForAuth: true
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      title: 'Registro',
      requiresAuth: false,
      hideForAuth: true
    }
  },
  {
    path: '/trips',
    name: 'trips',
    component: Trips,
    meta: {
      title: 'Mis Viajes',
      requiresAuth: true
    }
  },
  {
    path: '/trips/:id',
    name: 'trip-details',
    component: TripDetails,
    meta: {
      title: 'Detalles del Viaje',
      requiresAuth: true
    }
  },
  {
    path: '/explore',
    name: 'explore',
    component: Explore,
    meta: {
      title: 'Explorar Destinos',
      requiresAuth: false
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: {
      title: 'Mi Perfil',
      requiresAuth: true
    }
  },
  // La ruta 404 puede ser manejada por la página Home temporalmente
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: Home, // Usamos Home en lugar de NotFound
    meta: {
      title: 'Página no encontrada'
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Guard de navegación
router.beforeEach((to, from, next) => {
  // Obtener el estado de autenticación
  const isAuthenticated = !!localStorage.getItem('token')

  // Actualizar el título de la página
  document.title = `${to.meta.title} - Planificador de Viajes`

  // Redirigir al login si la ruta requiere autenticación
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  // Redirigir al home si el usuario está autenticado e intenta acceder a login/register
  else if (to.meta.hideForAuth && isAuthenticated) {
    next({ path: '/' })
  }
  // Continuar normalmente
  else {
    next()
  }
})

export default router