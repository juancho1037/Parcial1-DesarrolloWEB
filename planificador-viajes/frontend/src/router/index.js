import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/modules/auth";

// Importación de vistas principales
const Home = () => import("@/views/Home.vue");
const Login = () => import("@/views/Login.vue");
const Register = () => import("@/views/Register.vue");
const ForgotPassword = () => import("@/views/ForgotPassword.vue");
const Explore = () => import("@/views/Explore.vue");
const Profile = () => import("@/views/Profile.vue");
const NotFound = () => import("@/views/NotFound.vue");

// Importación de componentes de viajes (ruta corregida)
const Trips = () => import("@/components/trips/TripList.vue");
const TripCreate = () => import("@/components/trips/TripCreate.vue");
const TripEdit = () => import("@/components/trips/TripEdit.vue");
const TripDetails = () => import("@/components/trips/TripDetails.vue");
const TripItinerary = () => import("@/components/trips/TripItinerary.vue");

// Importación de componentes de destinos (ruta corregida)
const Destinations = () => import("@/components/destinations/DestinationList.vue");
const DestinationDetails = () => import("@/components/destinations/DestinationDetails.vue");
const DestinationMap = () => import("@/components/destinations/DestinationMap.vue");

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { 
      title: "Inicio",
      requiresAuth: false 
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { 
      title: "Iniciar Sesión",
      requiresAuth: false, 
      hideForAuth: true 
    }
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { 
      title: "Registro",
      requiresAuth: false, 
      hideForAuth: true 
    }
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
    meta: { 
      title: "Recuperar Contraseña",
      requiresAuth: false, 
      hideForAuth: true 
    }
  },
  {
    path: "/explore",
    name: "Explore",
    component: Explore,
    meta: { 
      title: "Explorar",
      requiresAuth: false 
    }
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { 
      title: "Mi Perfil",
      requiresAuth: true 
    }
  },
  // Rutas de viajes
  {
    path: "/trips",
    name: "Trips",
    component: Trips,
    meta: { 
      title: "Mis Viajes",
      requiresAuth: true 
    }
  },
  {
    path: "/trips/Create",
    name: "TripCreate",
    component: TripCreate,
    meta: { 
      title: "Crear Viaje",
      requiresAuth: true 
    }
  },
  {
    path: "/trips/:id",
    name: "TripDetails",
    component: TripDetails,
    meta: { 
      title: "Detalles del Viaje",
      requiresAuth: true 
    }
  },
  {
    path: "/trips/:id/edit",
    name: "TripEdit",
    component: TripEdit,
    meta: { 
      title: "Editar Viaje",
      requiresAuth: true 
    }
  },
  {
    path: "/trips/:id/itinerary",
    name: "TripItinerary",
    component: TripItinerary,
    meta: { 
      title: "Itinerario del Viaje",
      requiresAuth: true 
    }
  },
  // Rutas de destinos
  {
    path: "/destinations",
    name: "Destinations",
    component: Destinations,
    meta: { 
      title: "Destinos",
      requiresAuth: false 
    }
  },
  {
    path: "/destinations/:id",
    name: "DestinationDetails",
    component: DestinationDetails,
    meta: { 
      title: "Detalles del Destino",
      requiresAuth: false 
    }
  },
  {
    path: "/destinations/:id/map",
    name: "DestinationMap",
    component: DestinationMap,
    meta: { 
      title: "Mapa del Destino",
      requiresAuth: false 
    }
  },
  // Ruta 404
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: { 
      title: "Página no encontrada",
      requiresAuth: false 
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  }
});

// Guardián de navegación
router.beforeEach(async (to, from, next) => {
  // Actualizar el título de la página
  document.title = `${to.meta.title} - Travel Planner`;
  
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  // Redirección para rutas protegidas
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      name: "Login",
      query: { redirect: to.fullPath }
    });
    return;
  }

  // Redirección para rutas de auth cuando ya está autenticado
  if (to.meta.hideForAuth && isAuthenticated) {
    next({ name: "Home" });
    return;
  }

  next();
});

// Manejo de errores de navegación
router.onError((error) => {
  console.error("Error de navegación:", error);
  router.push({ name: "NotFound" });
});

export default router;
