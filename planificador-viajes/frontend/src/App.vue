<template>
  <v-app>
    <!-- Overlay de carga global -->
    <v-overlay :model-value="isLoading" class="align-center justify-center">
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <!-- Navbar -->
    <Navbar v-if="showNavbar" />

    <!-- Contenido principal -->
    <v-main>
      <!-- Transiciones entre rutas -->
      <v-fade-transition mode="out-in">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </v-fade-transition>
    </v-main>

    <!-- Footer -->
    <Footer v-if="showFooter" />

    <!-- Snackbar global -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout" location="top">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Diálogo de confirmación global -->
    <v-dialog v-model="dialog.show" max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          {{ dialog.title }}
        </v-card-title>

        <v-card-text>
          {{ dialog.message }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="handleDialogResponse(false)">
            {{ dialog.cancelText }}
          </v-btn>
          <v-btn color="primary" @click="handleDialogResponse(true)" :loading="dialog.loading">
            {{ dialog.confirmText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/modules/app'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'

export default defineComponent({
  name: 'App',

  components: {
    Navbar,
    Footer
  },

  setup() {
    const appStore = useAppStore()
    const { snackbar, dialog, isLoading } = storeToRefs(appStore)
    const route = useRoute()

    return {
      snackbar,
      dialog,
      isLoading,
      route
    }
  },

  computed: {
    // Determina si se debe mostrar el navbar
    showNavbar() {
      return !['Login', 'Register', 'ForgotPassword'].includes(this.route.name)
    },

    // Determina si se debe mostrar el footer
    showFooter() {
      return !['Login', 'Register', 'ForgotPassword'].includes(this.route.name)
    }
  },

  methods: {
    // Maneja la respuesta del diálogo de confirmación
    handleDialogResponse(confirmed) {
      if (this.dialog.loading) return

      if (confirmed && this.dialog.onConfirm) {
        this.dialog.onConfirm()
      } else if (!confirmed && this.dialog.onCancel) {
        this.dialog.onCancel()
      }

      this.dialog.show = false
    }
  },

  // Manejo de errores global
  errorCaptured(err, vm, info) {
    console.error('Error capturado en App.vue:', err, info)

    // Mostrar snackbar de error
    this.snackbar = {
      show: true,
      color: 'error',
      text: 'Ha ocurrido un error. Por favor, intenta nuevamente.',
      timeout: 5000
    }

    return false // Evita que el error se propague
  }
})
</script>

<style>
/* Estilos globales */
:root {
  --navbar-height: 64px;
  --footer-height: 56px;
}

/* Ajuste para el contenido principal */
.v-main {
  min-height: calc(100vh - var(--navbar-height) - var(--footer-height)) !important;
  background-color: #f8fafc;
}

/* Animaciones suaves */
.v-fade-transition-enter-active,
.v-fade-transition-leave-active {
  transition: opacity 0.2s ease;
}

.v-fade-transition-enter-from,
.v-fade-transition-leave-to {
  opacity: 0;
}

/* Mejoras de rendimiento */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Estilos para scrollbar personalizada */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #666;
}

/* Utilidades globales */
.cursor-pointer {
  cursor: pointer;
}

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

/* Evitar selección de texto en elementos interactivos */
.v-btn,
.v-icon {
  user-select: none;
}

/* Estilos para dispositivos móviles */
@media (max-width: 600px) {
  :root {
    --navbar-height: 56px;
  }

  .v-main {
    padding-top: var(--navbar-height) !important;
  }
}
</style>
