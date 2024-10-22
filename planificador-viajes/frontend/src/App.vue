<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style>
:root {
  --primary-color: #1976d2;
  --secondary-color: #424242;
}

body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
}

.v-application {
  background: #f8fafc !important;
}

/* Transiciones de página */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Estilos globales */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Utilidades */
.text-gradient {
  background: linear-gradient(45deg, var(--v-primary-base), #1976d2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hover-scale {
  transition: transform 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.02);
}
</style>
