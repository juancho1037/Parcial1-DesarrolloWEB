<template>
  <div class="trip-details-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <v-parallax
        :src="trip.coverImage || '/default-destination.jpg'"
        height="400"
      >
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <v-container class="h-100">
            <v-row align="end" class="h-100 pb-8">
              <v-col cols="12" sm="8">
                <div class="d-flex align-center mb-2">
                  <v-btn
                    icon="mdi-arrow-left"
                    variant="text"
                    color="white"
                    size="small"
                    class="mr-4"
                    @click="$router.back()"
                  ></v-btn>
                  <v-chip color="primary" size="small">{{ trip.status }}</v-chip>
                </div>
                <h1 class="text-h3 font-weight-bold text-white mb-2">
                  {{ trip.destination }}
                </h1>
                <div class="text-subtitle-1 text-white">
                  {{ formatDateRange(trip.startDate, trip.endDate) }}
                  ({{ trip.numberOfDays }} días)
                </div>
              </v-col>
              <v-col cols="12" sm="4" class="d-flex justify-end align-center">
                <v-btn
                  color="primary"
                  prepend-icon="mdi-pencil"
                  class="mr-2"
                  @click="editTrip"
                >
                  Editar
                </v-btn>
                <v-btn
                  color="error"
                  variant="outlined"
                  prepend-icon="mdi-delete"
                  @click="confirmDelete"
                >
                  Eliminar
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-parallax>
    </section>

    <!-- Main Content -->
    <v-container class="py-8">
      <v-row>
        <!-- Left Column - Trip Information -->
        <v-col cols="12" md="8">
          <!-- Trip Overview -->
          <v-card class="mb-6" elevation="2" rounded="lg">
            <v-card-title class="text-h6 pa-6">
              <v-icon start color="primary">mdi-information</v-icon>
              Información General
            </v-card-title>
            <v-card-text class="pa-6 pt-0">
              <v-row>
                <v-col cols="6" sm="3">
                  <div class="overview-item">
                    <v-icon color="primary" size="32" class="mb-2">
                      mdi-calendar-range
                    </v-icon>
                    <div class="text-h6 font-weight-bold">{{ trip.numberOfDays }}</div>
                    <div class="text-caption">Días</div>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="overview-item">
                    <v-icon color="primary" size="32" class="mb-2">
                      mdi-map-marker-multiple
                    </v-icon>
                    <div class="text-h6 font-weight-bold">
                      {{ trip.activities?.length || 0 }}
                    </div>
                    <div class="text-caption">Actividades</div>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="overview-item">
                    <v-icon color="primary" size="32" class="mb-2">
                      mdi-weather-sunny
                    </v-icon>
                    <div class="text-h6 font-weight-bold">{{ trip.weather }}°C</div>
                    <div class="text-caption">Temperatura</div>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="overview-item">
                    <v-icon color="primary" size="32" class="mb-2">
                      mdi-currency-usd
                    </v-icon>
                    <div class="text-h6 font-weight-bold">${{ trip.budget }}</div>
                    <div class="text-caption">Presupuesto</div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Activities Timeline -->
          <v-card class="mb-6" elevation="2" rounded="lg">
            <v-card-title class="d-flex justify-space-between align-center pa-6">
              <div class="d-flex align-center">
                <v-icon start color="primary">mdi-calendar-check</v-icon>
                <span class="ml-2">Itinerario</span>
              </div>
              <v-btn
                color="primary"
                variant="text"
                prepend-icon="mdi-plus"
                @click="showAddActivity = true"
              >
                Añadir Actividad
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-6 pt-0">
              <v-timeline align="start" density="comfortable">
                <v-timeline-item
                  v-for="activity in sortedActivities"
                  :key="activity.id"
                  :dot-color="getActivityColor(activity.category)"
                  size="small"
                >
                  <template v-slot:opposite>
                    <div class="text-caption">
                      {{ formatDate(activity.date) }}
                    </div>
                  </template>
                  <v-card class="activity-card">
                    <v-card-text>
                      <div class="d-flex justify-space-between align-center">
                        <div>
                          <div class="text-subtitle-1 font-weight-medium">
                            {{ activity.name }}
                          </div>
                          <div class="d-flex align-center mt-1">
                            <v-chip
                              :color="getActivityColor(activity.category)"
                              size="x-small"
                              class="mr-2"
                            >
                              {{ activity.category }}
                            </v-chip>
                            <span class="text-caption text-medium-emphasis">
                              {{ activity.time }}
                            </span>
                          </div>
                        </div>
                        <div class="d-flex">
                          <v-btn
                            icon="mdi-pencil"
                            variant="text"
                            size="small"
                            @click="editActivity(activity)"
                          ></v-btn>
                          <v-btn
                            icon="mdi-delete"
                            variant="text"
                            size="small"
                            color="error"
                            @click="deleteActivity(activity)"
                          ></v-btn>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-timeline-item>
              </v-timeline>

              <div v-if="!trip.activities?.length" class="text-center pa-8">
                <v-icon size="48" color="grey" class="mb-4">
                  mdi-calendar-blank
                </v-icon>
                <div class="text-h6 text-grey">No hay actividades planificadas</div>
                <v-btn
                  color="primary"
                  class="mt-4"
                  @click="showAddActivity = true"
                >
                  Planificar Primera Actividad
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <!-- Notes Section -->
          <v-card elevation="2" rounded="lg">
            <v-card-title class="pa-6">
              <v-icon start color="primary">mdi-note-text</v-icon>
              Notas
            </v-card-title>
            <v-card-text class="pa-6 pt-0">
              <v-textarea
                v-model="trip.notes"
                rows="4"
                variant="outlined"
                placeholder="Añade notas sobre tu viaje..."
                @change="saveNotes"
              ></v-textarea>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column - Additional Info -->
        <v-col cols="12" md="4">
          <!-- Weather Card -->
          <v-card class="mb-6" elevation="2" rounded="lg">
            <v-card-title class="pa-6">
              <v-icon start color="primary">mdi-weather-partly-cloudy</v-icon>
              Clima
            </v-card-title>
            <v-card-text class="pa-6 pt-0">
              <div class="weather-info">
                <div class="text-h3 font-weight-bold mb-2">{{ trip.weather }}°C</div>
                <div class="text-body-1">{{ trip.weatherDescription }}</div>
                <div class="text-caption text-medium-emphasis">
                  Promedio para las fechas seleccionadas
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Budget Card -->
          <v-card class="mb-6" elevation="2" rounded="lg">
            <v-card-title class="pa-6">
              <v-icon start color="primary">mdi-wallet</v-icon>
              Presupuesto
            </v-card-title>
            <v-card-text class="pa-6 pt-0">
              <v-list>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-airplane</v-icon>
                  </template>
                  <v-list-item-title>Transporte</v-list-item-title>
                  <v-list-item-subtitle class="text-right">
                    ${{ trip.transportBudget }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-bed</v-icon>
                  </template>
                  <v-list-item-title>Alojamiento</v-list-item-title>
                  <v-list-item-subtitle class="text-right">
                    ${{ trip.accommodationBudget }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-food</v-icon>
                  </template>
                  <v-list-item-title>Comidas</v-list-item-title>
                  <v-list-item-subtitle class="text-right">
                    ${{ trip.foodBudget }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider class="my-2"></v-divider>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-cash</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-bold">Total</v-list-item-title>
                  <v-list-item-subtitle class="text-right text-primary font-weight-bold">
                    ${{ trip.budget }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>

          <!-- Location Card -->
          <v-card elevation="2" rounded="lg">
            <v-card-title class="pa-6">
              <v-icon start color="primary">mdi-map</v-icon>
              Ubicación
            </v-card-title>
            <v-card-text class="pa-6 pt-0">
              <div class="location-map mb-4" style="height: 200px; background: #f0f0f0;">
                <!-- Aquí iría el mapa -->
                <div class="d-flex align-center justify-center h-100">
                  <v-icon size="48" color="grey">mdi-map-marker</v-icon>
                </div>
              </div>
              <div class="text-body-1 font-weight-medium">{{ trip.location }}</div>
              <div class="text-caption text-medium-emphasis">
                {{ trip.locationDetails }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Add/Edit Activity Dialog -->
    <v-dialog v-model="showAddActivity" max-width="600">
      <v-card>
        <v-card-title class="text-h5 pa-6">
          {{ editingActivity ? 'Editar' : 'Añadir' }} Actividad
        </v-card-title>
        <v-card-text class="pa-6 pt-0">
          <v-form @submit.prevent="saveActivity">
            <v-text-field
              v-model="activityForm.name"
              label="Nombre de la actividad"
              variant="outlined"
              class="mb-4"
              required
            ></v-text-field>

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="activityForm.date"
                  label="Fecha"
                  type="date"
                  variant="outlined"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="activityForm.time"
                  label="Hora"
                  type="time"
                  variant="outlined"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-select
              v-model="activityForm.category"
              :items="activityCategories"
              label="Categoría"
              variant="outlined"
              class="mb-4"
              required
            ></v-select>

            <v-textarea
              v-model="activityForm.notes"
              label="Notas"
              variant="outlined"
              rows="3"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="showAddActivity = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            @click="saveActivity"
          >
            {{ editingActivity ? 'Actualizar' : 'Añadir' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

<!-- Delete Confirmation Dialog -->
<v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5 pa-6">
          Eliminar Viaje
        </v-card-title>
        <v-card-text class="pa-6 pt-0">
          ¿Estás seguro de que deseas eliminar este viaje? Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="showDeleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            @click="deleteTrip"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'TripDetails',
  data() {
    return {
      trip: {
        id: '1',
        destination: 'París',
        location: 'París, Francia',
        locationDetails: 'Île-de-France, Francia',
        startDate: '2024-12-20',
        endDate: '2024-12-27',
        numberOfDays: 7,
        status: 'Planificado',
        weather: 18,
        weatherDescription: 'Parcialmente nublado',
        budget: 2500,
        transportBudget: 800,
        accommodationBudget: 1000,
        foodBudget: 700,
        notes: '',
        coverImage: '/images/paris.jpg',
        activities: [
          {
            id: '1',
            name: 'Visita a la Torre Eiffel',
            date: '2024-12-21',
            time: '10:00',
            category: 'Turismo',
            notes: 'Reservar tickets con anticipación'
          },
          {
            id: '2',
            name: 'Cena en Le Cheval Blanc',
            date: '2024-12-22',
            time: '20:00',
            category: 'Gastronomía',
            notes: 'Restaurante con 3 estrellas Michelin'
          }
        ]
      },
      showAddActivity: false,
      showDeleteDialog: false,
      editingActivity: null,
      activityForm: {
        name: '',
        date: '',
        time: '',
        category: '',
        notes: ''
      },
      activityCategories: [
        'Turismo',
        'Gastronomía',
        'Cultura',
        'Aventura',
        'Relax',
        'Compras'
      ],
      snackbar: {
        show: false,
        text: '',
        color: 'success'
      }
    }
  },
  computed: {
    sortedActivities() {
      return [...this.trip.activities].sort((a, b) => 
        new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time)
      )
    }
  },
  methods: {
    formatDateRange(start, end) {
      const startDate = new Date(start)
      const endDate = new Date(end)
      return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },
    getActivityColor(category) {
      const colors = {
        'Turismo': 'blue',
        'Gastronomía': 'orange',
        'Cultura': 'purple',
        'Aventura': 'green',
        'Relax': 'cyan',
        'Compras': 'pink'
      }
      return colors[category] || 'grey'
    },
    editActivity(activity) {
      this.editingActivity = activity
      this.activityForm = { ...activity }
      this.showAddActivity = true
    },
    async saveActivity() {
      // Aquí iría la lógica para guardar la actividad
      if (this.editingActivity) {
        const index = this.trip.activities.findIndex(a => a.id === this.editingActivity.id)
        this.trip.activities[index] = { ...this.editingActivity, ...this.activityForm }
      } else {
        const newActivity = {
          id: Date.now().toString(),
          ...this.activityForm
        }
        this.trip.activities.push(newActivity)
      }
      
      this.showAddActivity = false
      this.editingActivity = null
      this.activityForm = {
        name: '',
        date: '',
        time: '',
        category: '',
        notes: ''
      }
      
      this.showSnackbar('Actividad guardada correctamente')
    },
    async deleteActivity(activity) {
      // Aquí iría la lógica para eliminar la actividad
      const index = this.trip.activities.findIndex(a => a.id === activity.id)
      this.trip.activities.splice(index, 1)
      this.showSnackbar('Actividad eliminada correctamente')
    },
    editTrip() {
      // Implementar edición del viaje
      this.showSnackbar('Función en desarrollo', 'info')
    },
    confirmDelete() {
      this.showDeleteDialog = true
    },
    async deleteTrip() {
      // Aquí iría la lógica para eliminar el viaje
      this.showDeleteDialog = false
      this.showSnackbar('Viaje eliminado correctamente')
      this.$router.push('/trips')
    },
    async saveNotes() {
      // Aquí iría la lógica para guardar las notas
      this.showSnackbar('Notas guardadas correctamente')
    },
    showSnackbar(text, color = 'success') {
      this.snackbar.text = text
      this.snackbar.color = color
      this.snackbar.show = true
    }
  },
  async mounted() {
    // Aquí iría la lógica para cargar los datos del viaje
    const tripId = this.$route.params.id
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}
</script>

<style scoped>
.trip-details-container {
  background: #f8fafc;
}

/* Hero Section */
.hero-section {
  position: relative;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6));
}

.hero-content {
  position: relative;
  z-index: 1;
  height: 100%;
}

/* Cards */
.overview-item {
  text-align: center;
  padding: 1rem;
  border-radius: 12px;
  transition: background-color 0.3s ease;
}

.overview-item:hover {
  background: rgba(var(--v-theme-primary), 0.05);
}

/* Timeline */
.activity-card {
  transition: transform 0.3s ease;
}

.activity-card:hover {
  transform: translateX(4px);
}

/* Weather Card */
.weather-info {
  text-align: center;
  padding: 1rem;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.v-card {
  animation: fadeIn 0.6s ease-out forwards;
}

/* Responsive */
@media (max-width: 960px) {
  .hero-section {
    height: 300px;
  }
  
  .text-h3 {
    font-size: 2rem !important;
  }
}

/* Location Map */
.location-map {
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
}

/* Custom Scrollbar */
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
  background: #555;
}
</style>