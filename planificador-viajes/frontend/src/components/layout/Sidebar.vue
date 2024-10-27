<template>
  <v-navigation-drawer v-model="modelValue" :location="location" :temporary="temporary" width="280" class="sidebar">
    <!-- Header del Sidebar -->
    <v-list-item v-if="isAuthenticated" class="user-info pa-4" :prepend-avatar="`/api/placeholder/120/120`">
      <template v-slot:prepend>
        <v-avatar color="primary" v-if="!user?.avatar">
          <span class="text-h6 text-white">{{ userInitials }}</span>
        </v-avatar>
      </template>
      <v-list-item-title class="font-weight-bold">
        {{ user?.name || 'Usuario' }}
      </v-list-item-title>
      <v-list-item-subtitle>{{ user?.email }}</v-list-item-subtitle>
    </v-list-item>

    <v-divider></v-divider>

    <!-- Menú principal -->
    <v-list density="comfortable">
      <template v-for="(item, index) in navigationItems" :key="index">
        <!-- Grupo de navegación con subitems -->
        <template v-if="item.items">
          <v-list-group :value="item.title" class="menu-group">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" :prepend-icon="item.icon" :title="item.title"
                :value="item.title"></v-list-item>
            </template>

            <v-list-item v-for="subItem in item.items" :key="subItem.title" :to="subItem.to"
              :prepend-icon="subItem.icon" :title="subItem.title" :value="subItem.title" class="submenu-item"
              @click="handleItemClick"></v-list-item>
          </v-list-group>
        </template>

        <!-- Item individual -->
        <v-list-item v-else :to="item.to" :prepend-icon="item.icon" :title="item.title" :value="item.title"
          class="menu-item" @click="handleItemClick">
          <!-- Badge para notificaciones -->
          <template v-slot:append v-if="item.badge">
            <v-badge :content="item.badge" :color="item.badgeColor || 'error'" floating></v-badge>
          </template>
        </v-list-item>
      </template>
    </v-list>

    <v-divider></v-divider>

    <!-- Sección de viajes recientes -->
    <div v-if="isAuthenticated" class="recent-trips pa-4">
      <div class="d-flex align-center justify-space-between mb-4">
        <span class="text-subtitle-2 font-weight-bold">Viajes Recientes</span>
        <v-btn variant="text" density="comfortable" size="small" to="/trips" class="px-0">
          Ver todos
        </v-btn>
      </div>

      <v-list density="compact">
        <v-list-item v-for="trip in recentTrips" :key="trip.id" :to="`/trips/${trip.id}`" class="recent-trip-item"
          rounded="lg">
          <template v-slot:prepend>
            <v-avatar size="32">
              <v-img :src="`/api/placeholder/100/100`" :alt="trip.name"></v-img>
            </v-avatar>
          </template>
          <v-list-item-title class="text-subtitle-2">
            {{ trip.name }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            {{ formatDate(trip.startDate) }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </div>

    <!-- Footer del Sidebar -->
    <template v-slot:append>
      <div class="pa-4">
        <v-divider class="mb-4"></v-divider>
        <!-- Selector de tema -->
        <div class="d-flex align-center justify-space-between mb-4">
          <span class="text-body-2">Modo Oscuro</span>
          <v-switch v-model="isDarkMode" hide-details density="compact" color="primary"
            @change="toggleTheme"></v-switch>
        </div>
        <!-- Botón de cerrar sesión -->
        <v-btn v-if="isAuthenticated" block color="error" variant="tonal" prepend-icon="mdi-logout" @click="logout">
          Cerrar Sesión
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/modules/auth'
import { useAppStore } from '@/store/modules/app'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default {
  name: 'Sidebar',

  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    location: {
      type: String,
      default: 'left'
    },
    temporary: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const authStore = useAuthStore()
    const appStore = useAppStore()

    // Estado
    const isDarkMode = ref(false)

    // Computed
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const user = computed(() => authStore.user)
    const userInitials = computed(() => authStore.userInitials)

    // Items de navegación
    const navigationItems = [
      {
        title: 'Inicio',
        icon: 'mdi-home',
        to: '/'
      },
      {
        title: 'Explorar',
        icon: 'mdi-compass',
        to: '/explore'
      },
      {
        title: 'Mis Viajes',
        icon: 'mdi-airplane',
        items: [
          {
            title: 'Todos los Viajes',
            icon: 'mdi-format-list-bulleted',
            to: '/trips'
          },
          {
            title: 'Crear Viaje',
            icon: 'mdi-plus',
            to: '/trips/create'
          },
          {
            title: 'Calendario',
            icon: 'mdi-calendar',
            to: '/trips/calendar'
          }
        ]
      },
      {
        title: 'Favoritos',
        icon: 'mdi-heart',
        to: '/favorites',
        badge: '3',
        badgeColor: 'primary'
      },
      {
        title: 'Mi Perfil',
        icon: 'mdi-account',
        to: '/profile'
      },
      {
        title: 'Configuración',
        icon: 'mdi-cog',
        to: '/settings'
      }
    ]

    // Viajes recientes (simulados)
    const recentTrips = [
      {
        id: 1,
        name: 'París 2024',
        startDate: '2024-06-15'
      },
      {
        id: 2,
        name: 'Tokyo',
        startDate: '2024-08-20'
      },
      {
        id: 3,
        name: 'Barcelona',
        startDate: '2024-09-10'
      }
    ]

    // Métodos
    const handleItemClick = () => {
      if (props.temporary) {
        emit('update:modelValue', false)
      }
    }

    const toggleTheme = () => {
      // Aquí iría la lógica para cambiar el tema
      appStore.showSnackbar({
        text: `Modo ${isDarkMode.value ? 'oscuro' : 'claro'} activado`,
        color: 'success'
      })
    }

    const formatDate = (date) => {
      return format(new Date(date), 'dd MMM yyyy', { locale: es })
    }

    const logout = async () => {
      try {
        await authStore.logout()
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      }
    }

    return {
      isAuthenticated,
      user,
      userInitials,
      navigationItems,
      recentTrips,
      isDarkMode,
      handleItemClick,
      toggleTheme,
      formatDate,
      logout
    }
  }
}
</script>

<style scoped>
.sidebar {
  background: linear-gradient(to bottom, rgba(var(--v-theme-surface), 0.98), rgba(var(--v-theme-surface), 1));
  backdrop-filter: blur(10px);
}

.user-info {
  transition: background-color 0.3s ease;
}

.user-info:hover {
  background: rgba(var(--v-theme-primary), 0.05);
}

.menu-item {
  border-radius: 8px;
  margin: 4px 8px;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background: rgba(var(--v-theme-primary), 0.05);
  transform: translateX(4px);
}

.submenu-item {
  margin-left: 16px;
  border-radius: 8px;
}

.recent-trip-item {
  transition: all 0.3s ease;
}

.recent-trip-item:hover {
  background: rgba(var(--v-theme-primary), 0.05);
  transform: translateX(4px);
}

/* Animaciones */
.v-navigation-drawer-enter-active,
.v-navigation-drawer-leave-active {
  transition: transform 0.3s ease;
}

.v-navigation-drawer-enter-from,
.v-navigation-drawer-leave-to {
  transform: translateX(-100%);
}

/* Soporte para modo oscuro */
:deep(.v-theme--dark) {
  .sidebar {
    background: linear-gradient(to bottom, rgba(30, 30, 30, 0.98), rgba(30, 30, 30, 1));
  }

  .user-info:hover,
  .menu-item:hover,
  .recent-trip-item:hover {
    background: rgba(255, 255, 255, 0.05);
  }
}
</style>