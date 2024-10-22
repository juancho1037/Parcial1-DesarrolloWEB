<template>
  <v-container class="profile-container py-8">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <!-- Header Section -->
        <div class="profile-header mb-8">
          <v-card class="header-card" elevation="2" rounded="lg">
            <v-card-text class="pa-6">
              <div class="d-flex flex-wrap align-center">
                <v-avatar size="120" color="primary" class="mr-6">
                  <span class="text-h3 text-white">{{ userInitials }}</span>
                </v-avatar>
                <div class="flex-grow-1">
                  <h1 class="text-h4 font-weight-bold mb-2">{{ userName }}</h1>
                  <p class="text-subtitle-1 text-medium-emphasis mb-2">{{ userEmail }}</p>
                  <div class="d-flex align-center">
                    <v-chip
                      color="primary"
                      size="small"
                      class="mr-2"
                    >
                      {{ totalTrips }} Viajes
                    </v-chip>
                    <v-chip
                      color="success"
                      size="small"
                    >
                      Viajero Activo
                    </v-chip>
                  </div>
                </div>
                <v-btn
                  color="primary"
                  variant="outlined"
                  class="mt-4 mt-sm-0"
                  prepend-icon="mdi-pencil"
                  @click="editProfile"
                >
                  Editar Perfil
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- Stats Cards -->
        <v-row class="mb-8">
          <v-col cols="12" sm="4">
            <v-card class="stat-card" elevation="1" rounded="lg">
              <v-card-text>
                <div class="d-flex align-center">
                  <v-icon size="36" color="primary" class="mr-3">mdi-airplane</v-icon>
                  <div>
                    <div class="text-h4 font-weight-bold">{{ totalTrips }}</div>
                    <div class="text-caption text-medium-emphasis">Viajes Totales</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="4">
            <v-card class="stat-card" elevation="1" rounded="lg">
              <v-card-text>
                <div class="d-flex align-center">
                  <v-icon size="36" color="success" class="mr-3">mdi-map-marker-multiple</v-icon>
                  <div>
                    <div class="text-h4 font-weight-bold">{{ visitedPlaces }}</div>
                    <div class="text-caption text-medium-emphasis">Lugares Visitados</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="4">
            <v-card class="stat-card" elevation="1" rounded="lg">
              <v-card-text>
                <div class="d-flex align-center">
                  <v-icon size="36" color="info" class="mr-3">mdi-calendar-check</v-icon>
                  <div>
                    <div class="text-h4 font-weight-bold">{{ daysOfTravel }}</div>
                    <div class="text-caption text-medium-emphasis">Días de Viaje</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Settings Sections -->
        <v-card class="mb-6" elevation="2" rounded="lg">
          <v-card-title class="text-h6 pa-6">
            Preferencias de Viaje
          </v-card-title>
          <v-card-text class="pa-6 pt-0">
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="preferences.currency"
                  :items="currencies"
                  label="Moneda Preferida"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="preferences.language"
                  :items="languages"
                  label="Idioma"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Security Section -->
        <v-card class="mb-6" elevation="2" rounded="lg">
          <v-card-title class="text-h6 pa-6">
            Seguridad
          </v-card-title>
          <v-card-text class="pa-6 pt-0">
            <v-btn
              color="primary"
              variant="outlined"
              class="mr-4"
              prepend-icon="mdi-lock"
              @click="changePassword"
            >
              Cambiar Contraseña
            </v-btn>
            <v-btn
              color="error"
              variant="outlined"
              prepend-icon="mdi-delete"
              @click="confirmDeleteAccount"
            >
              Eliminar Cuenta
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialogs -->
    <v-dialog v-model="editDialog" max-width="600">
      <v-card>
        <v-card-title class="text-h5 pa-6">
          Editar Perfil
        </v-card-title>
        <v-card-text class="pa-6 pt-0">
          <v-form @submit.prevent="saveProfile">
            <v-text-field
              v-model="editForm.name"
              label="Nombre"
              variant="outlined"
              class="mb-4"
            ></v-text-field>
            <v-text-field
              v-model="editForm.email"
              label="Email"
              variant="outlined"
              type="email"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="editDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            @click="saveProfile"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Change Password Dialog -->
    <v-dialog v-model="passwordDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5 pa-6">
          Cambiar Contraseña
        </v-card-title>
        <v-card-text class="pa-6 pt-0">
          <v-form @submit.prevent="updatePassword">
            <v-text-field
              v-model="passwordForm.current"
              label="Contraseña Actual"
              type="password"
              variant="outlined"
              class="mb-4"
            ></v-text-field>
            <v-text-field
              v-model="passwordForm.new"
              label="Nueva Contraseña"
              type="password"
              variant="outlined"
              class="mb-4"
            ></v-text-field>
            <v-text-field
              v-model="passwordForm.confirm"
              label="Confirmar Nueva Contraseña"
              type="password"
              variant="outlined"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="passwordDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            @click="updatePassword"
          >
            Actualizar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Account Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5 pa-6">
          ¿Eliminar cuenta?
        </v-card-title>
        <v-card-text class="pa-6 pt-0">
          Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar tu cuenta?
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="deleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            @click="deleteAccount"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      // User Data
      userName: 'Usuario de Prueba',
      userEmail: 'test@example.com',
      totalTrips: 5,
      visitedPlaces: 12,
      daysOfTravel: 45,

      // Dialogs
      editDialog: false,
      passwordDialog: false,
      deleteDialog: false,

      // Forms
      editForm: {
        name: '',
        email: ''
      },
      passwordForm: {
        current: '',
        new: '',
        confirm: ''
      },

      // Preferences
      preferences: {
        currency: 'USD',
        language: 'es'
      },

      // Select Options
      currencies: [
        { title: 'USD - Dólar Americano', value: 'USD' },
        { title: 'EUR - Euro', value: 'EUR' },
        { title: 'COP - Peso Colombiano', value: 'COP' }
      ],
      languages: [
        { title: 'Español', value: 'es' },
        { title: 'English', value: 'en' }
      ],

      // Snackbar
      snackbar: {
        show: false,
        text: '',
        color: 'success'
      }
    }
  },
  computed: {
    userInitials() {
      return this.userName.split(' ').map(n => n[0]).join('').toUpperCase()
    }
  },
  methods: {
    editProfile() {
      this.editForm.name = this.userName
      this.editForm.email = this.userEmail
      this.editDialog = true
    },
    saveProfile() {
      this.userName = this.editForm.name
      this.userEmail = this.editForm.email
      this.editDialog = false
      this.showSnackbar('Perfil actualizado correctamente', 'success')
    },
    changePassword() {
      this.passwordDialog = true
    },
    updatePassword() {
      if (this.passwordForm.new !== this.passwordForm.confirm) {
        this.showSnackbar('Las contraseñas no coinciden', 'error')
        return
      }
      this.passwordDialog = false
      this.showSnackbar('Contraseña actualizada correctamente', 'success')
    },
    confirmDeleteAccount() {
      this.deleteDialog = true
    },
    deleteAccount() {
      this.deleteDialog = false
      this.showSnackbar('Cuenta eliminada correctamente', 'success')
      setTimeout(() => {
        this.$router.push('/login')
      }, 1500)
    },
    showSnackbar(text, color = 'success') {
      this.snackbar.text = text
      this.snackbar.color = color
      this.snackbar.show = true
    }
  },
  mounted() {
    // Aquí podrías cargar los datos del usuario
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.name) {
      this.userName = user.name
      this.userEmail = user.email
    }
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
}

.header-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.stat-card {
  background: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1) !important;
}

/* Animaciones */
.stat-card {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>