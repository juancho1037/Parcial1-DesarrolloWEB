<template>
  <div class="navbar-wrapper">
    <v-app-bar
      class="px-3 custom-navbar"
      height="70"
      elevation="1"
    >
      <div class="d-flex align-center navbar-content">
        <!-- Logo y Título -->
        <div class="d-flex align-center brand-section">
          <v-btn
            class="logo-btn mr-2"
            icon
            variant="text"
            to="/"
          >
            <v-icon size="32" color="primary">mdi-airplane</v-icon>
          </v-btn>
          <router-link to="/" class="text-decoration-none">
            <div class="brand-text">
              <span class="text-h6 font-weight-bold gradient-text">Planificador de Viajes</span>
            </div>
          </router-link>
        </div>

        <v-spacer></v-spacer>

        <!-- Links de Navegación -->
        <div class="navigation-links d-none d-md-flex align-center">
          <v-btn
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            variant="text"
            class="nav-btn mx-2"
            :class="{ 'active-link': isCurrentPath(item.path) }"
          >
            <v-icon start :icon="item.icon" class="mr-1"></v-icon>
            {{ item.title }}
          </v-btn>
        </div>

        <!-- Botones de Usuario -->
        <div class="user-actions d-flex align-center ml-4">
          <template v-if="isLoggedIn">
            <v-btn
              class="user-btn"
              variant="text"
              @click="toggleUserMenu"
            >
              <v-avatar size="32" color="primary" class="mr-2">
                <span class="text-white">{{ userInitials }}</span>
              </v-avatar>
              <span class="d-none d-sm-inline">{{ userName }}</span>
              <v-icon end>mdi-chevron-down</v-icon>
            </v-btn>
            
            <!-- Menú de Usuario -->
            <v-menu
              v-model="showUserMenu"
              :close-on-content-click="false"
              location="bottom end"
              transition="slide-y-transition"
            >
              <v-card min-width="200" class="user-menu">
                <v-list>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-account</v-icon>
                    </template>
                    <v-list-item-title>Mi Perfil</v-list-item-title>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-cog</v-icon>
                    </template>
                    <v-list-item-title>Configuración</v-list-item-title>
                  </v-list-item>

                  <v-divider></v-divider>

                  <v-list-item @click="logout" color="error">
                    <template v-slot:prepend>
                      <v-icon color="error">mdi-logout</v-icon>
                    </template>
                    <v-list-item-title class="text-error">Cerrar Sesión</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </template>
          
          <template v-else>
            <v-btn
              to="/login"
              variant="text"
              class="login-btn mx-2"
              :class="{ 'active-link': isCurrentPath('/login') }"
            >
              <v-icon start>mdi-login</v-icon>
              Login
            </v-btn>
            <v-btn
              to="/register"
              color="primary"
              class="register-btn"
              elevation="1"
              rounded
            >
              <v-icon start>mdi-account-plus</v-icon>
              Registro
            </v-btn>
          </template>
        </div>

        <!-- Menú Móvil -->
        <v-btn
          class="d-md-none ml-4"
          icon
          @click="showMobileMenu = !showMobileMenu"
        >
          <v-icon>{{ showMobileMenu ? 'mdi-close' : 'mdi-menu' }}</v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <!-- Menú Móvil Desplegable -->
    <v-expand-transition>
      <div v-if="showMobileMenu" class="mobile-menu">
        <v-list>
          <v-list-item
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            :active="isCurrentPath(item.path)"
            class="mobile-menu-item"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      showUserMenu: false,
      showMobileMenu: false,
      navigationItems: [
        { title: 'Inicio', path: '/', icon: 'mdi-home' },
        { title: 'Mis Viajes', path: '/trips', icon: 'mdi-airplane' },
        { title: 'Explorar', path: '/explore', icon: 'mdi-compass' }
      ]
    }
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token')
    },
    userName() {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      return user.name || 'Usuario'
    },
    userInitials() {
      return this.userName.charAt(0).toUpperCase()
    }
  },
  methods: {
    isCurrentPath(path) {
      return this.$route.path === path
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.showUserMenu = false
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.navbar-wrapper {
  position: relative;
}

.custom-navbar {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.navbar-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.brand-section {
  transition: transform 0.3s ease;
}

.brand-section:hover {
  transform: translateY(-2px);
}

.logo-btn {
  background: linear-gradient(135deg, var(--v-theme-primary) 0%, #1976d2 100%);
  color: white !important;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.logo-btn:hover {
  transform: rotate(15deg);
  box-shadow: 0 4px 15px rgba(var(--v-theme-primary), 0.2);
}

.gradient-text {
  background: linear-gradient(45deg, var(--v-theme-primary), #1976d2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-btn {
  position: relative;
  margin: 0 8px;
  height: 40px;
  transition: all 0.3s ease;
}

.nav-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--v-theme-primary);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-btn:hover::after,
.active-link::after {
  width: 100%;
}

.user-btn {
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  border-radius: 40px;
  padding: 4px 16px;
  transition: all 0.3s ease;
}

.user-btn:hover {
  background: rgba(var(--v-theme-primary), 0.05);
  transform: translateY(-2px);
}

.login-btn {
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
}

.register-btn {
  transition: all 0.3s ease;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(var(--v-theme-primary), 0.3);
}

.user-menu {
  border-radius: 12px;
  overflow: hidden;
}

.mobile-menu {
  position: absolute;
  top: 70px;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.1);
  z-index: 100;
}

.mobile-menu-item {
  transition: background 0.3s ease;
}

.mobile-menu-item:hover {
  background: rgba(var(--v-theme-primary), 0.05);
}

/* Animaciones */
.slide-y-transition-enter-active,
.slide-y-transition-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-y-transition-enter-from,
.slide-y-transition-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

@media (max-width: 960px) {
  .navigation-links {
    display: none !important;
  }
}
</style>