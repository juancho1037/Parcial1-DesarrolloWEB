<template>
  <v-container class="trips-dashboard pa-6">
    <!-- Header with stats -->
    <v-row class="header-section mb-8">
      <v-col cols="12" class="mb-6">
        <div class="d-flex justify-space-between align-center">
          <div>
            <h1 class="text-h3 font-weight-bold gradient-text mb-2">Mis Viajes</h1>
            <span class="text-subtitle-1 text-medium-emphasis">
              Planifica y organiza tus próximas aventuras
            </span>
          </div>
          <v-btn
            color="primary"
            size="large"
            prepend-icon="mdi-airplane-plus"
            elevation="2"
            rounded
            @click="showAddTripDialog = true"
            class="px-6 text-none text-subtitle-1"
          >
            Nuevo Viaje
          </v-btn>
        </div>
      </v-col>
      
      <!-- Stats Cards -->
      <v-col cols="12" sm="4">
        <v-card class="stat-card" elevation="1" rounded="lg">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="32" color="primary" class="mr-3">mdi-map-marker-multiple</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">{{ trips.length }}</div>
                <div class="text-subtitle-2 text-medium-emphasis">Viajes Planificados</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="4">
        <v-card class="stat-card" elevation="1" rounded="lg">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="32" color="success" class="mr-3">mdi-calendar-check</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">{{ totalActivities }}</div>
                <div class="text-subtitle-2 text-medium-emphasis">Actividades Totales</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="4">
        <v-card class="stat-card" elevation="1" rounded="lg">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="32" color="info" class="mr-3">mdi-clock-time-four</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">{{ totalDays }}</div>
                <div class="text-subtitle-2 text-medium-emphasis">Días de Viaje</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Trips Grid -->
    <v-row v-if="trips.length > 0">
      <v-col v-for="trip in trips" :key="trip.id" cols="12" md="6" lg="4">
        <v-card
          class="trip-card h-100"
          elevation="2"
          rounded="lg"
          hover
        >
          <v-img
            :src="getTripImage(trip.destination)"
            height="200"
            cover
            class="bg-grey-lighten-2"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          
          <v-card-title class="pt-4 pb-2">
            <div class="d-flex align-center justify-space-between">
              <span class="text-h5">{{ trip.destination }}</span>
              <v-chip
                color="primary"
                size="small"
                label
                class="ml-2"
              >
                {{ trip.numberOfDays }} días
              </v-chip>
            </div>
          </v-card-title>

          <v-card-text>
            <div class="d-flex align-center mb-3">
              <v-icon size="18" color="primary" class="mr-2">mdi-calendar</v-icon>
              <span class="text-body-2">{{ formatDateRange(trip.startDate, trip.endDate) }}</span>
            </div>
            
            <div class="d-flex align-center">
              <v-icon size="18" color="primary" class="mr-2">mdi-briefcase</v-icon>
              <span class="text-body-2">
                {{ (trip.activities || []).length }} actividades planificadas
              </span>
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="pa-4">
            <v-btn
              color="primary"
              variant="tonal"
              block
              @click="showTripDetails(trip)"
              class="text-none"
            >
              Ver Detalles
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State with Animation -->
    <v-row v-else justify="center" class="mt-16">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <v-img
          src="/empty-state-illustration.svg"
          max-width="300"
          class="mx-auto mb-6"
        ></v-img>
        <h3 class="text-h5 font-weight-bold mb-2">¡Comienza Tu Próxima Aventura!</h3>
        <p class="text-body-1 text-medium-emphasis mb-6">
          Planifica tu primer viaje y empieza a crear recuerdos inolvidables.
        </p>
        <v-btn
          color="primary"
          size="large"
          prepend-icon="mdi-plus"
          rounded
          elevation="2"
          @click="showAddTripDialog = true"
          class="px-6"
        >
          Crear mi primer viaje
        </v-btn>
      </v-col>
    </v-row>

    <!-- New Trip Dialog -->
    <v-dialog
      v-model="showAddTripDialog"
      width="600"
      transition="dialog-bottom-transition"
    >
      <v-card class="rounded-lg">
        <v-toolbar
          color="primary"
          class="pa-3"
        >
          <v-toolbar-title class="text-h6 font-weight-bold">
            Planifica un Nuevo Viaje
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="showAddTripDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-6">
          <v-form @submit.prevent="submitNewTrip" ref="form">
            <v-text-field
              v-model="newTrip.destination"
              label="¿A dónde viajarás?"
              prepend-inner-icon="mdi-map-marker"
              variant="outlined"
              :rules="[(v) => !!v || 'El destino es requerido']"
              required
            ></v-text-field>

            <v-row>
              <v-col cols="12" sm="6">
                <v-date-picker
                  v-model="newTrip.startDate"
                  label="Fecha de inicio"
                  prepend-inner-icon="mdi-calendar"
                  variant="outlined"
                  :rules="[(v) => !!v || 'La fecha de inicio es requerida']"
                  required
                ></v-date-picker>
              </v-col>
              <v-col cols="12" sm="6">
                <v-date-picker
                  v-model="newTrip.endDate"
                  label="Fecha de fin"
                  prepend-inner-icon="mdi-calendar"
                  variant="outlined"
                  :rules="[
                    (v) => !!v || 'La fecha de fin es requerida',
                    (v) => new Date(v) >= new Date(newTrip.startDate) || 'La fecha de fin debe ser posterior a la de inicio'
                  ]"
                  required
                ></v-date-picker>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            variant="tonal"
            @click="showAddTripDialog = false"
            class="mr-2"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            @click="submitNewTrip"
            :loading="isSubmitting"
          >
            Crear Viaje
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Trip Details Dialog -->
    <v-dialog
      v-model="showTripDetailsDialog"
      width="800"
      transition="dialog-bottom-transition"
    >
      <v-card v-if="selectedTrip" class="rounded-lg">
        <v-img
          :src="getTripImage(selectedTrip.destination)"
          height="200"
          cover
          class="bg-grey-lighten-2"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-row>
          </template>
        </v-img>

        <v-card-title class="pt-4 pb-2 text-h4 font-weight-bold">
          {{ selectedTrip.destination }}
        </v-card-title>

        <v-card-text>
          <div class="d-flex align-center mb-6">
            <v-icon color="primary" class="mr-2">mdi-calendar-range</v-icon>
            <span class="text-body-1">
              {{ formatDateRange(selectedTrip.startDate, selectedTrip.endDate) }}
              ({{ selectedTrip.numberOfDays }} días)
            </span>
          </div>

          <v-divider class="mb-6"></v-divider>

          <h3 class="text-h6 font-weight-bold mb-4">
            <v-icon color="primary" class="mr-2">mdi-briefcase-check</v-icon>
            Actividades Planificadas
          </h3>

          <v-expansion-panels v-if="selectedTrip.activities?.length">
            <v-expansion-panel
              v-for="activity in selectedTrip.activities"
              :key="activity.id"
            >
              <v-expansion-panel-title>
                <div class="d-flex align-center">
                  <v-icon color="primary" class="mr-2">
                    {{ getCategoryIcon(activity.category) }}
                  </v-icon>
                  <span>{{ activity.name }}</span>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="d-flex align-center mb-2">
                  <v-icon size="small" color="grey" class="mr-2">
                    mdi-calendar
                  </v-icon>
                  <span class="text-body-2">{{ formatDate(activity.date) }}</span>
                </div>
                <div class="d-flex align-center">
                  <v-icon size="small" color="grey" class="mr-2">
                    mdi-tag
                  </v-icon>
                  <v-chip
                    size="small"
                    :color="getCategoryColor(activity.category)"
                    variant="tonal"
                  >
                    {{ activity.category }}
                  </v-chip>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-alert
            v-else
            type="info"
            variant="tonal"
            class="mt-2"
            icon="mdi-information"
          >
            No hay actividades planificadas para este viaje.
          </v-alert>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-btn
            prepend-icon="mdi-plus"
            color="primary"
            variant="tonal"
            class="mr-2"
          >
            Añadir Actividad
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="showTripDetailsDialog = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
const SAMPLE_TRIPS = [
  {
    id: "1",
    destination: "París",
    startDate: "2024-12-20",
    endDate: "2024-12-27",
    numberOfDays: 7,
    activities: [
      {
        id: "1",
        name: "Visita a la Torre Eiffel",
        category: "Turismo",
        date: "2024-12-21",
      },
      {
        id: "2",
        name: "Cena en Le Cheval Blanc",
        category: "Gastronomía",
        date: "2024-12-22",
      },
    ],
  },
  {
    id: "2",
    destination: "Roma",
    startDate: "2025-01-15",
    endDate: "2025-01-22",
    numberOfDays: 7,
    activities: [
      {
        id: "3",
        name: "Visita al Coliseo",
        category: "Turismo",
        date: "2025-01-16",
      },
    ],
  },
];

export default {
  name: "Trips",
  data() {
    return {
      trips: [],
      selectedTrip: null,
      showAddTripDialog: false,
      showTripDetailsDialog: false,
      isSubmitting: false,
      newTrip: {
        destination: "",
        startDate: "",
        endDate: "",
      },
    };
  },
  computed: {
    totalActivities() {
      return this.trips.reduce((total, trip) => {
        return total + (trip.activities?.length || 0);
      }, 0);
    },
    totalDays() {
      return this.trips.reduce((total, trip) => {
        return total + (trip.numberOfDays || 0);
      }, 0);
    },
  },
  methods: {
    async fetchTrips() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        this.trips = SAMPLE_TRIPS;
      } catch (error) {
        console.error("Error fetching trips:", error);
        this.trips = [];
      }
    },
    formatDate(dateString) {
      if (!dateString) return "";
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    formatDateRange(startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start.getMonth() === end.getMonth()) {
        return `${start.getDate()} - ${end.getDate()} de ${start.toLocaleDateString(
          "es-ES",
          { month: "long" }
        )} de ${start.getFullYear()}`;
      }
      
      return `${this.formatDate(startDate)} - ${this.formatDate(endDate)}`;
    },
    getTripImage(destination) {
      // En una implementación real, esto vendría de una API o base de datos
      const images = {
        'París': '/images/paris.jpg',
        'Roma': '/images/rome.jpg',
        'default': '/images/default-destination.jpg'
      };
      return images[destination] || images.default;
    },
    getCategoryIcon(category) {
      const icons = {
        'Turismo': 'mdi-camera',
        'Gastronomía': 'mdi-food',
        'Cultura': 'mdi-palette',
        'Aventura': 'mdi-hiking',
        'default': 'mdi-star'
      };
      return icons[category] || icons.default;
    },
    getCategoryColor(category) {
      const colors = {
        'Turismo': 'blue',
        'Gastronomía': 'orange',
        'Cultura': 'purple',
        'Aventura': 'green',
        'default': 'grey'
      };
      return colors[category] || colors.default;
    },
    showTripDetails(trip) {
      this.selectedTrip = trip;
      this.showTripDetailsDialog = true;
    },
    async submitNewTrip() {
      if (!this.$refs.form.validate()) return;

      this.isSubmitting = true;
      
      try {
        const start = new Date(this.newTrip.startDate);
        const end = new Date(this.newTrip.endDate);
        const numberOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        const trip = {
          id: Date.now().toString(),
          ...this.newTrip,
          numberOfDays,
          activities: [],
        };

        // Simulamos una llamada a la API
        await new Promise(resolve => setTimeout(resolve, 1000));

        this.trips.push(trip);
        this.showAddTripDialog = false;
        
        // Mostrar notificación de éxito
        this.$nextTick(() => {
          this.$refs.successSnackbar.show();
        });

        // Resetear el formulario
        this.resetForm();
      } catch (error) {
        console.error('Error creating trip:', error);
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.newTrip = {
        destination: "",
        startDate: "",
        endDate: "",
      };
      this.$refs.form.reset();
    }
  },
  mounted() {
    this.fetchTrips();
  }
};
</script>

<style scoped>
.trips-dashboard {
  max-width: 1400px;
}

.gradient-text {
  background: linear-gradient(45deg, var(--v-primary-base), var(--v-secondary-base));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.trip-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.trip-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);
}

.stat-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Animaciones para los diálogos */
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.3s ease-in-out;
}

.dialog-bottom-transition-enter-from,
.dialog-bottom-transition-leave-to {
  transform: translateY(100%);
}

/* Animación para las cards de estadísticas */
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

.stat-card {
  animation: fadeInUp 0.6s ease-out forwards;
}

.stat-card:nth-child(1) {
  animation-delay: 0.1s;
}

.stat-card:nth-child(2) {
  animation-delay: 0.2s;
}

.stat-card:nth-child(3) {
  animation-delay: 0.3s;
}

/* Estilos para el empty state */
.empty-state-animation {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>