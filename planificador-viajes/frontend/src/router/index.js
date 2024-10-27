import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/modules/auth.js";

// Importación de vistas
const Home = () => import("@/views/Home.vue");
const Login = () => import("@/views/Login.vue");
const Register = () => import("@/views/Register.vue");
const Explore = () => import("@/views/Explore.vue");
const Profile = () => import("@/views/Profile.vue");
const NotFound = () => import("@/views/NotFound.vue");

// Importación de vistas de viajes
const Trips = () => import("@/components/trips/TripList.vue");
const TripCreate = () => import("@/components/trips/TripCreate.vue");
const TripEdit = () => import("@/components/trips/TripEdit.vue");
const TripDetails = () => import("@/components/trips/TripDetails.vue");

// Configuración de rutas
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "Inicio",
      requiresAuth: false,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "Iniciar Sesión",
      requiresAuth: false,
      hideForAuth: true, // Ocultar si el usuario está autenticado
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      title: "Registro",
      requiresAuth: false,
      hideForAuth: true,
    },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("@/views/ForgotPassword.vue"),
    meta: {
      title: "Recuperar Contraseña",
      requiresAuth: false,
      hideForAuth: true,
    },
  },
  {
    path: "/explore",
    name: "Explore",
    component: Explore,
    meta: {
      title: "Explorar Destinos",
      requiresAuth: false,
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      title: "Mi Perfil",
      requiresAuth: true,
    },
  },
  // Rutas de viajes
  {
    path: "/trips",
    name: "Trips",
    component: Trips,
    meta: {
      title: "Mis Viajes",
      requiresAuth: true,
    },
  },
  {
    path: "/trips/create",
    name: "TripCreate",
    component: TripCreate,
    meta: {
      title: "Crear Viaje",
      requiresAuth: true,
    },
  },
  {
    path: "/trips/:id",
    name: "TripDetails",
    component: TripDetails,
    meta: {
      title: "Detalles del Viaje",
      requiresAuth: true,
    },
  },
  {
    path: "/trips/:id/edit",
    name: "TripEdit",
    component: TripEdit,
    meta: {
      title: "Editar Viaje",
      requiresAuth: true,
    },
  },
  // Ruta 404
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: {
      title: "Página no encontrada",
      requiresAuth: false,
    },
  },
];

// Creación del router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Configuración del scroll
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Guardián de navegación
router.beforeEach(async (to, from, next) => {
  // Actualizar el título de la página
  document.title = `${to.meta.title} - Travel Planner`;

  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  // Redireccionar si la ruta requiere autenticación y el usuario no está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      name: "Login",
      query: { redirect: to.fullPath },
    });
    return;
  }

  // Redireccionar si la ruta está marcada como hideForAuth y el usuario está autenticado
  if (to.meta.hideForAuth && isAuthenticated) {
    next({ name: "Home" });
    return;
  }

  // Continuar con la navegación normal
  next();
});

// Manejo de errores de navegación
router.onError((error) => {
  console.error("Error de navegación:", error);
  router.push({ name: "NotFound" });
});

export default router;
