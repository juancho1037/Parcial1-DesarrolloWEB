<template>
  <div>
    <!-- Barra de navegación principal -->
    <v-app-bar elevation="2" :height="84" class="px-2 navbar-blur">
      <!-- Logo y nombre -->
      <router-link to="/" class="text-decoration-none d-flex align-center navbar-brand">
        <v-icon color="primary" size="32" class="mr-2 brand-icon">
          mdi-airplane
        </v-icon>
        <span class="text-primary font-weight-bold text-h6 brand-text">
          Planificador de Viajes
        </span>
      </router-link>

      <v-spacer></v-spacer>

      <!-- Búsqueda Global (escritorio) -->
      <v-slide-x-transition>
        <div v-if="showSearch" class="global-search d-none d-md-flex mx-4">
          <v-text-field v-model="searchQuery" density="compact" variant="outlined"
            placeholder="Buscar destinos, viajes..." prepend-inner-icon="mdi-magnify" hide-details class="search-field"
            @keyup.enter="handleSearch">
            <template v-slot:append>
              <v-fade-transition>
                <v-progress-circular v-if="searching" indeterminate color="primary" size="20"></v-progress-circular>
              </v-fade-transition>
            </template>
          </v-text-field>
        </div>
      </v-slide-x-transition>

      <!-- Botón de búsqueda (escritorio) -->
      <v-btn v-if="!showSearch" icon class="d-none d-md-flex" @click="toggleSearch">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <!-- Navegación principal (escritorio) -->
      <div class="d-none d-md-flex align-center">
        <v-slide-x-transition group>
          <v-btn v-for="item in navigationItems" :key="item.title" :to="item.to" :prepend-icon="item.icon"
            variant="text" class="mx-1" :class="{ 'text-primary': isCurrentRoute(item.to) }">
            {{ item.title }}
          </v-btn>
        </v-slide-x-transition>
      </div>

      <!-- Notificaciones -->
      <v-btn v-if="isAuthenticated" icon class="ml-2" @click="toggleNotifications">
        <v-badge :content="unreadNotifications" :model-value="unreadNotifications > 0" color="error">
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>

      <!-- Menú de usuario -->
      <v-menu v-if="isAuthenticated" v-model="userMenu" :close-on-content-click="false" location="bottom end"
        offset="10" transition="scale-transition">
        <template v-slot:activator="{ props }">
          <v-btn class="ml-4" v-bind="props">
            <v-avatar color="primary" size="32" class="mr-2">
              <span class="text-h6 text-white">{{ userInitials }}</span>
            </v-avatar>
            <span class="d-none d-sm-inline">{{ user?.name }}</span>
            <v-icon end>
              {{ userMenu ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
            </v-icon>
          </v-btn>
        </template>

        <v-card min-width="300" class="mt-2">
          <v-list>
            <v-list-item>
              <template v-slot:prepend>
                <v-avatar color="primary" size="40">
                  <span class="text-h6 text-white">{{ userInitials }}</span>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold">
                {{ user?.name }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ user?.email }}</v-list-item-subtitle>
            </v-list-item>

            <v-divider class="my-2"></v-divider>

            <v-list-item v-for="item in userMenuItems" :key="item.title" :to="item.to" :prepend-icon="item.icon"
              :title="item.title" :color="item.color" class="menu-item" @click="item.action"></v-list-item>
          </v-list>
        </v-card>
      </v-menu>

      <!-- Botones de autenticación -->
      <template v-else>
        <v-btn to="/login" variant="text" prepend-icon="mdi-login" class="ml-2">
          Iniciar Sesión
        </v-btn>
      </template>

      <!-- Botón de menú móvil -->
      <v-btn class="d-md-none ml-2" icon @click="mobileMenu = true">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Panel de notificaciones -->
    <v-navigation-drawer v-model="showNotifications" location="right" temporary width="400">
      <v-toolbar color="primary" title="Notificaciones">
        <v-spacer></v-spacer>
        <v-btn icon @click="showNotifications = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-list>
        <template v-if="notifications.length">
          <v-list-item v-for="notification in notifications" :key="notification.id" :title="notification.title"
            :subtitle="notification.message" :class="{ 'unread': !notification.read }">
            <template v-slot:prepend>
              <v-icon :color="notification.color">{{ notification.icon }}</v-icon>
            </template>
            <template v-slot:append>
              <v-btn icon="mdi-close" variant="text" size="small"
                @click.stop="removeNotification(notification.id)"></v-btn>
            </template>
          </v-list-item>
        </template>
        <v-list-item v-else>
          <v-list-item-title class="text-center text-medium-emphasis">
            No hay notificaciones
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Menú móvil -->
    <v-navigation-drawer v-model="mobileMenu" location="right" temporary class="mobile-menu">
      <v-list>
        <!-- Búsqueda móvil -->
        <v-list-item>
          <v-text-field v-model="searchQuery" density="compact" variant="outlined" placeholder="Buscar..."
            prepend-inner-icon="mdi-magnify" hide-details class="mt-2" @keyup.enter="handleSearch"></v-text-field>
        </v-list-item>

        <v-divider class="my-2"></v-divider>

        <!-- Ítems de navegación móvil -->
        <v-list-item v-for="item in navigationItems" :key="item.title" :to="item.to" :prepend-icon="item.icon"
          :title="item.title" :active="isCurrentRoute(item.to)" @click="mobileMenu = false"></v-list-item>

        <v-divider class="my-2"></v-divider>

        <!-- Opciones de usuario en móvil -->
        <template v-if="isAuthenticated">
          <v-list-item v-for="item in userMenuItems" :key="item.title" :prepend-icon="item.icon" :title="item.title"
            :to="item.to" :color="item.color" @click="item.action"></v-list-item>
        </template>
        <template v-else>
          <v-list-item to="/login" prepend-icon="mdi-login" title="Iniciar Sesión"></v-list-item>
          <v-list-item to="/register" prepend-icon="mdi-account-plus" title="Registrarse"></v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import { useAppStore } from '@/store/modules/app'

export default {
  name: 'Navbar',

  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    const appStore = useAppStore()

    // Estado
    const mobileMenu = ref(false)
    const userMenu = ref(false)
    const showSearch = ref(false)
    const searchQuery = ref('')
    const searching = ref(false)
    const showNotifications = ref(false)
    const notifications = ref([
      {
        id: 1,
        title: 'Nuevo destino disponible',
        message: '¡París está en oferta!',
        icon: 'mdi-map-marker',
        color: 'primary',
        read: false
      },
      {
        id: 2,
        title: 'Recordatorio de viaje',
        message: 'Tu viaje a Roma comienza en 3 días',
        icon: 'mdi-airplane',
        color: 'success',
        read: true
      }
    ])

    // Items de navegación
    const navigationItems = [
      { title: 'Inicio', to: '/', icon: 'mdi-home' },
      { title: 'Explorar', to: '/explore', icon: 'mdi-compass' },
      { title: 'Mis Viajes', to: '/trips', icon: 'mdi-airplane' }
    ]

    // Items del menú de usuario
    const userMenuItems = [
      {
        title: 'Mi Perfil',
        icon: 'mdi-account',
        to: '/profile'
      },
      {
        title: 'Mis Viajes',
        icon: 'mdi-airplane',
        to: '/trips'
      },
      {
        title: 'Configuración',
        icon: 'mdi-cog',
        to: '/settings'
      },
      {
        title: 'Cerrar Sesión',
        icon: 'mdi-logout',
        color: 'error',
        action: () => {
          authStore.logout()
          userMenu.value = false
        }
      }
    ]

    // Computed
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const user = computed(() => authStore.user)
    const userInitials = computed(() => authStore.userInitials)
    const unreadNotifications = computed(() =>
      notifications.value.filter(n => !n.read).length
    )

    // Métodos
    const isCurrentRoute = (path) => route.path === path

    const toggleSearch = () => {
      showSearch.value = !showSearch.value
      if (showSearch.value) {
        setTimeout(() => {
          document.querySelector('.search-field input')?.focus()
        }, 100)
      }
    }

    const handleSearch = async () => {
      if (!searchQuery.value.trim()) return

      searching.value = true
      try {
        // Aquí iría la lógica de búsqueda
        await new Promise(resolve => setTimeout(resolve, 1000))
        router.push({
          path: '/search',
          query: { q: searchQuery.value }
        })
      } catch (error) {
        appStore.showSnackbar({
          text: 'Error al realizar la búsqueda',
          color: 'error'
        })
      } finally {
        searching.value = false
        showSearch.value = false
        searchQuery.value = ''
      }
    }

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value
      if (showNotifications.value) {
        notifications.value = notifications.value.map(n => ({ ...n, read: true }))
      }
    }

    const removeNotification = (id) => {
      notifications.value = notifications.value.filter(n => n.id !== id)
    }

    return {
      // Estado
      mobileMenu,
      userMenu,
      showSearch,
      searchQuery,
      searching,
      showNotifications,
      notifications,
      navigationItems,
      userMenuItems,

      // Computed
      isAuthenticated,
      user,
      userInitials,
      unreadNotifications,

      // Métodos
      isCurrentRoute,
      toggleSearch,
      handleSearch,
      toggleNotifications,
      removeNotification
    }
  }
}
</script>

<style scoped>
.navbar-blur {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.navbar-brand {
  transition: transform 0.3s ease;
}

.navbar-brand:hover {
  transform: scale(1.05);
}

.brand-icon {
  animation: float 6s ease-in-out infinite;
}

.global-search {
  width: 400px;
  max-width: 100%;
}

.search-field {
  transition: all 0.3s ease;
}

.search-field:focus-within {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.menu-item {
  transition: background-color 0.3s ease;
}

.menu-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.unread {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-5px);
  }

  100% {
    transform: translateY(0px);
  }
}

/* Responsive */
@media (max-width: 960px) {
  .global-search {
    width: 300px;
  }

  .brand-text {
    font-size: 1.25rem !important;
  }
}

@media (max-width: 600px) {
  .navbar-blur {
    padding: 0.5rem !important;
  }

  .brand-text {
    display: none;
  }

  .brand-icon {
    margin-right: 0;
  }

  .global-search {
    width: 100%;
    padding: 0 1rem;
  }

  .mobile-menu {
    width: 100% !important;
  }

  /* Ajustes para el menú móvil */
  :deep(.v-navigation-drawer__content) {
    display: flex;
    flex-direction: column;
  }

  :deep(.v-list) {
    padding: 0.5rem;
  }

  :deep(.v-list-item) {
    border-radius: 8px;
    margin-bottom: 0.25rem;
  }

  :deep(.v-list-item:hover) {
    background-color: rgba(var(--v-theme-primary), 0.05);
  }

  /* Animaciones para el menú móvil */
  .v-navigation-drawer-enter-active,
  .v-navigation-drawer-leave-active {
    transition: transform 0.3s ease;
  }

  .v-navigation-drawer-enter-from,
  .v-navigation-drawer-leave-to {
    transform: translateX(100%);
  }

  /* Ajustes para el panel de notificaciones en móvil */
  :deep(.v-navigation-drawer.notifications) {
    width: 100% !important;
  }

  /* Ajustes para el menú de usuario en móvil */
  .v-menu__content {
    width: calc(100% - 2rem) !important;
    max-width: none !important;
    left: 1rem !important;
  }
}

/* Animaciones adicionales */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Transiciones para los elementos del navbar */
.v-btn {
  transition: all 0.3s ease;
}

.v-btn:hover {
  transform: translateY(-1px);
}

/* Efecto hover para los items de navegación */
.navigation-item {
  position: relative;
  overflow: hidden;
}

.navigation-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: var(--v-theme-primary);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.navigation-item:hover::after {
  width: 100%;
}

/* Estilos para las notificaciones */
.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  background-color: var(--v-theme-error);
  color: white;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
}

/* Mejoras en la accesibilidad */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

/* Soporte para modo oscuro */
:deep(.v-theme--dark) {
  .navbar-blur {
    background: rgba(30, 30, 30, 0.9) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }

  .search-field {
    background: rgba(255, 255, 255, 0.05);
  }

  .menu-item:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .unread {
    background-color: rgba(255, 255, 255, 0.05);
  }
}

/* Utilidades adicionales */
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.position-relative {
  position: relative;
}
</style>