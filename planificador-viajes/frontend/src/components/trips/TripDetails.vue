<template>
  <div class="trip-details">
    <!-- Loading state -->
    <div v-if="loading" class="d-flex justify-center align-center" style="min-height: 80vh">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <!-- Error state -->
    <v-card v-else-if="error" class="error-state mx-auto pa-6 text-center">
      <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
      <h3 class="text-h5 font-weight-bold mb-2">
        Error al cargar el viaje
      </h3>
      <p class="text-body-1 text-medium-emphasis mb-4">
        No se pudo cargar la información del viaje. Por favor, intenta nuevamente.
      </p>
      <v-btn color="primary" @click="fetchTripDetails">
        Reintentar
      </v-btn>
    </v-card>

    <!-- Trip Details Content -->
    <template v-else>
      <!-- Header con imagen de fondo -->
      <div class="trip-header position-relative">
        <v-img :src="`/api/placeholder/1920/400`" height="400" class="header-image"
          gradient="to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)">
          <!-- Overlay con información principal -->
          <div class="header-content d-flex flex-column justify-end fill-height pa-6">
            <div class="d-flex align-center mb-4">
              <h1 class="text-h3 font-weight-bold text-white">
                {{ trip.title }}
              </h1>
              <v-spacer></v-spacer>
              <v-btn icon="mdi-heart" variant="text" color="white" size="large"
                :class="{ 'favorite-active': trip.isFavorite }" @click="toggleFavorite"></v-btn>
            </div>

            <div class="d-flex align-center flex-wrap gap-4">
              <v-chip :color="getStatusColor(trip.status)" class="text-uppercase">
                {{ getStatusLabel(trip.status) }}
              </v-chip>
              <div class="d-flex align-center text-white">
                <v-icon start color="white">mdi-map-marker</v-icon>
                {{ trip.destination }}
              </div>
              <div class="d-flex align-center text-white">
                <v-icon start color="white">mdi-calendar</v-icon>
                {{ formatDateRange(trip.startDate, trip.endDate) }}
              </div>
              <div class="d-flex align-center text-white">
                <v-icon start color="white">mdi-account-group</v-icon>
                {{ trip.travelers.length }} viajeros
              </div>
            </div>
          </div>

          <!-- Botones de acción flotantes -->
          <div class="action-buttons pa-4 position-absolute top-0 end-0">
            <v-btn color="primary" class="mr-2" prepend-icon="mdi-pencil" @click="editTrip">
              Editar
            </v-btn>
            <v-btn color="primary" variant="outlined" class="bg-white" prepend-icon="mdi-share-variant"
              @click="shareTrip">
              Compartir
            </v-btn>
          </div>
        </v-img>
      </div>

      <!-- Contenido principal -->
      <v-container class="pt-6">
        <v-row>
          <!-- Columna principal -->
          <v-col cols="12" md="8">
            <!-- Descripción -->
            <v-card class="mb-6">
              <v-card-title class="text-h6 font-weight-bold">
                Sobre este viaje
              </v-card-title>
              <v-card-text>
                <p class="text-body-1">{{ trip.description }}</p>
              </v-card-text>
            </v-card>

            <!-- Itinerario -->
            <v-card class="mb-6">
              <v-card-title class="d-flex align-center text-h6 font-weight-bold">
                Itinerario
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" prepend-icon="mdi-calendar" @click="viewFullItinerary">
                  Ver completo
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-timeline density="compact" align="start">
                  <v-timeline-item v-for="day in itinerarySummary" :key="day.date"
                    :dot-color="day.activities.length ? 'primary' : 'grey'" size="small">
                    <template v-slot:opposite>
                      <strong>{{ formatDate(day.date) }}</strong>
                    </template>
                    <div class="mb-2">
                      <template v-if="day.activities.length">
                        <div v-for="activity in day.activities" :key="activity.id" class="d-flex align-center mb-1">
                          <v-icon :color="getCategoryColor(activity.category)" size="small" class="mr-2">
                            {{ getCategoryIcon(activity.category) }}
                          </v-icon>
                          <span>{{ activity.name }}</span>
                        </div>
                      </template>
                      <span v-else class="text-medium-emphasis">
                        Sin actividades planificadas
                      </span>
                    </div>
                  </v-timeline-item>
                </v-timeline>
              </v-card-text>
            </v-card>

            <!-- Viajeros -->
            <v-card class="mb-6">
              <v-card-title class="text-h6 font-weight-bold">
                Viajeros
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col v-for="traveler in trip.travelers" :key="traveler.email" cols="12" sm="6" md="4">
                    <v-card variant="outlined" class="traveler-card">
                      <v-card-text class="d-flex align-center">
                        <v-avatar color="primary" class="mr-3">
                          <span class="text-h6 text-white">
                            {{ getTravelerInitials(traveler.name) }}
                          </span>
                        </v-avatar>
                        <div>
                          <div class="font-weight-medium">{{ traveler.name }}</div>
                          <div class="text-caption text-medium-emphasis">
                            {{ traveler.email }}
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Barra lateral -->
          <v-col cols="12" md="4">
            <!-- Resumen de presupuesto -->
            <v-card class="mb-6">
              <v-card-title class="text-h6 font-weight-bold">
                Presupuesto
              </v-card-title>
              <v-card-text>
                <div class="budget-progress mb-4">
                  <div class="d-flex justify-space-between mb-2">
                    <span class="text-body-2">Gastos totales</span>
                    <span class="text-body-2 font-weight-medium">
                      {{ formatCurrency(totalExpenses) }} / {{ formatCurrency(trip.budget) }}
                    </span>
                  </div>
                  <v-progress-linear :model-value="budgetProgress" :color="budgetColor" height="10"
                    rounded></v-progress-linear>
                </div>

                <v-list density="compact">
                  <v-list-item v-for="category in expensesByCategory" :key="category.name" :title="category.name"
                    :subtitle="formatCurrency(category.total)">
                    <template v-slot:prepend>
                      <v-icon :color="category.color">
                        {{ category.icon }}
                      </v-icon>
                    </template>
                    <template v-slot:append>
                      {{ category.percentage }}%
                    </template>
                  </v-list-item>
                </v-list>

                <v-divider class="my-4"></v-divider>

                <div class="d-flex justify-center">
                  <v-btn color="primary" variant="outlined" prepend-icon="mdi-plus" @click="addExpense">
                    Agregar gasto
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>

            <!-- Checklist -->
            <v-card class="mb-6">
              <v-card-title class="text-h6 font-weight-bold d-flex align-center">
                Lista de verificación
                <v-spacer></v-spacer>
                <v-btn icon="mdi-plus" variant="text" density="comfortable" @click="addChecklistItem"></v-btn>
              </v-card-title>
              <v-card-text>
                <v-list density="comfortable">
                  <v-list-item v-for="item in trip.checklist" :key="item.id">
                    <template v-slot:prepend>
                      <v-checkbox v-model="item.completed" @change="updateChecklist(item)" hide-details
                        density="compact"></v-checkbox>
                    </template>
                    <v-list-item-title :class="{ 'text-decoration-line-through': item.completed }">
                      {{ item.text }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>

                <div v-if="!trip.checklist?.length" class="text-center py-4">
                  <v-icon color="grey-lighten-1" size="40" class="mb-2">mdi-format-list-checks</v-icon>
                  <div class="text-body-2 text-medium-emphasis">
                    No hay items en la lista
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <!-- Mapa -->
            <v-card>
              <v-card-title class="text-h6 font-weight-bold">
                Ubicación
              </v-card-title>
              <v-img :src="`/api/placeholder/400/300`" height="300" class="map-preview"></v-img>
              <v-card-actions>
                <v-btn block variant="text" prepend-icon="mdi-map" @click="openMap">
                  Ver en mapa completo
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Diálogo para agregar gastos -->
      <v-dialog v-model="expenseDialog.show" max-width="500">
        <v-card>
          <v-card-title class="text-h5">
            Agregar gasto
          </v-card-title>
          <v-card-text>
            <v-form ref="expenseForm">
              <v-text-field v-model="expenseDialog.data.description" label="Descripción" variant="outlined"
                :rules="rules.description" class="mb-4"></v-text-field>

              <v-text-field v-model.number="expenseDialog.data.amount" label="Monto" variant="outlined" type="number"
                prefix="$" :rules="rules.amount" class="mb-4"></v-text-field>

              <v-select v-model="expenseDialog.data.category" :items="expenseCategories" label="Categoría"
                variant="outlined" :rules="rules.category"></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey-darken-1" variant="text" @click="expenseDialog.show = false">
              Cancelar
            </v-btn>
            <v-btn color="primary" @click="saveExpense" :loading="expenseDialog.loading">
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Diálogo para compartir -->
      <v-dialog v-model="shareDialog.show" max-width="500">
        <v-card>
          <v-card-title class="text-h5">
            Compartir viaje
          </v-card-title>
          <v-card-text>
            <v-tabs v-model="shareDialog.tab" class="mb-4">
              <v-tab value="link">Enlace</v-tab>
              <v-tab value="email">Email</v-tab>
            </v-tabs>

            <v-window v-model="shareDialog.tab">
              <v-window-item value="link">
                <v-text-field v-model="shareDialog.link" readonly variant="outlined"
                  append-inner-icon="mdi-content-copy" @click:append-inner="copyLink"></v-text-field>
                <v-list density="compact" class="mb-2">
                  <v-list-subheader>Compartir en redes sociales</v-list-subheader>
                  <v-list-item v-for="network in socialNetworks" :key="network.name" :title="network.name"
                    :prepend-icon="network.icon" :color="network.color" @click="shareToSocial(network.type)"
                    class="social-share-item"></v-list-item>
                </v-list>
              </v-window-item>

              <v-window-item value="email">
                <v-text-field v-model="shareDialog.email" label="Email del destinatario" variant="outlined" type="email"
                  :rules="rules.email" class="mb-4"></v-text-field>
                <v-textarea v-model="shareDialog.message" label="Mensaje personalizado" variant="outlined"
                  rows="3"></v-textarea>
              </v-window-item>
            </v-window>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey-darken-1" variant="text" @click="shareDialog.show = false">
              Cancelar
            </v-btn>
            <v-btn v-if="shareDialog.tab === 'email'" color="primary" :loading="shareDialog.loading"
              @click="sendShareEmail">
              Enviar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Diálogo para agregar item a la checklist -->
      <v-dialog v-model="checklistDialog.show" max-width="500">
        <v-card>
          <v-card-title class="text-h5">
            Agregar item a la lista
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="checklistDialog.text" label="Descripción" variant="outlined" autofocus
              :rules="rules.checklistItem"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey-darken-1" variant="text" @click="checklistDialog.show = false">
              Cancelar
            </v-btn>
            <v-btn color="primary" :loading="checklistDialog.loading" @click="saveChecklistItem">
              Agregar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTripsStore } from '@/store/modules/trips'
import { useAppStore } from '@/store/modules/app'
import { format, eachDayOfInterval } from 'date-fns'
import { es } from 'date-fns/locale'

export default {
  name: 'TripDetails',

  setup() {
    const router = useRouter()
    const route = useRoute()
    const tripsStore = useTripsStore()
    const appStore = useAppStore()
    const expenseForm = ref(null)

    // Estado
    const loading = ref(true)
    const error = ref(false)
    const trip = ref(null)

    // Diálogos
    const expenseDialog = ref({
      show: false,
      loading: false,
      data: {
        description: '',
        amount: null,
        category: null
      }
    })

    const shareDialog = ref({
      show: false,
      loading: false,
      tab: 'link',
      link: '',
      email: '',
      message: ''
    })

    const checklistDialog = ref({
      show: false,
      loading: false,
      text: ''
    })

    // Datos estáticos
    const expenseCategories = [
      { title: 'Alojamiento', value: 'alojamiento' },
      { title: 'Transporte', value: 'transporte' },
      { title: 'Comida', value: 'comida' },
      { title: 'Actividades', value: 'actividades' },
      { title: 'Otros', value: 'otros' }
    ]

    const socialNetworks = [
      { name: 'WhatsApp', icon: 'mdi-whatsapp', color: 'success', type: 'whatsapp' },
      { name: 'Facebook', icon: 'mdi-facebook', color: 'blue', type: 'facebook' },
      { name: 'Twitter', icon: 'mdi-twitter', color: 'info', type: 'twitter' },
      { name: 'Telegram', icon: 'mdi-telegram', color: 'primary', type: 'telegram' }
    ]

    // Computed
    const totalExpenses = computed(() => {
      if (!trip.value?.expenses) return 0
      return trip.value.expenses.reduce((sum, expense) => sum + expense.amount, 0)
    })

    const budgetProgress = computed(() => {
      if (!trip.value?.budget || !totalExpenses.value) return 0
      return Math.min((totalExpenses.value / trip.value.budget) * 100, 100)
    })

    const budgetColor = computed(() => {
      const progress = budgetProgress.value
      if (progress >= 90) return 'error'
      if (progress >= 75) return 'warning'
      return 'success'
    })

    const expensesByCategory = computed(() => {
      if (!trip.value?.expenses) return []

      const categories = {}
      trip.value.expenses.forEach(expense => {
        if (!categories[expense.category]) {
          categories[expense.category] = {
            name: expenseCategories.find(cat => cat.value === expense.category)?.title || expense.category,
            total: 0,
            icon: getCategoryIcon(expense.category),
            color: getCategoryColor(expense.category)
          }
        }
        categories[expense.category].total += expense.amount
      })

      // Calcular porcentajes
      Object.values(categories).forEach(category => {
        category.percentage = Math.round((category.total / totalExpenses.value) * 100)
      })

      return Object.values(categories)
    })

    const itinerarySummary = computed(() => {
      if (!trip.value) return []

      const days = eachDayOfInterval({
        start: new Date(trip.value.startDate),
        end: new Date(trip.value.endDate)
      })

      return days.map(date => ({
        date: format(date, 'yyyy-MM-dd'),
        activities: trip.value.activities?.filter(activity =>
          activity.date === format(date, 'yyyy-MM-dd')
        ) || []
      }))
    })

    // Reglas de validación
    const rules = {
      description: [
        v => !!v || 'La descripción es requerida',
        v => v.length <= 100 || 'La descripción es demasiado larga'
      ],
      amount: [
        v => !!v || 'El monto es requerido',
        v => v > 0 || 'El monto debe ser mayor a 0'
      ],
      category: [
        v => !!v || 'La categoría es requerida'
      ],
      email: [
        v => !v || /.+@.+\..+/.test(v) || 'Email debe ser válido'
      ],
      checklistItem: [
        v => !!v || 'La descripción es requerida',
        v => v.length <= 200 || 'La descripción es demasiado larga'
      ]
    }

    // Métodos
    const fetchTripDetails = async () => {
      loading.value = true
      error.value = false

      try {
        const tripId = route.params.id
        const tripData = await tripsStore.getTripById(tripId)

        if (!tripData) {
          throw new Error('Viaje no encontrado')
        }

        trip.value = tripData
        shareDialog.value.link = `${window.location.origin}/trips/${tripId}`
      } catch (err) {
        console.error('Error al cargar detalles del viaje:', err)
        error.value = true
        appStore.showSnackbar({
          text: 'Error al cargar los detalles del viaje',
          color: 'error'
        })
      } finally {
        loading.value = false
      }
    }

    // Métodos de utilidad aquí...
    // (formatCurrency, getCategoryIcon, getCategoryColor, formatDate, etc.)

    onMounted(() => {
      fetchTripDetails()
    })

    return {
      // Estado
      loading,
      error,
      trip,
      expenseDialog,
      shareDialog,
      checklistDialog,
      expenseForm,

      // Datos
      expenseCategories,
      socialNetworks,
      rules,

      // Computed
      totalExpenses,
      budgetProgress,
      budgetColor,
      expensesByCategory,
      itinerarySummary,

      // Métodos
      fetchTripDetails,
      // ... otros métodos exportados
    }
  }
}
</script>

<style scoped>
.trip-details {
  min-height: calc(100vh - var(--navbar-height));
}

.trip-header {
  height: 400px;
}

.header-content {
  position: relative;
  z-index: 2;
}

.error-state {
  max-width: 500px;
  margin: 48px auto;
}

.traveler-card {
  transition: all 0.3s ease;
}

.traveler-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.social-share-item {
  cursor: pointer;
  transition: all 0.2s ease;
}

.social-share-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.favorite-active {
  color: #ff4081 !important;
}

.map-preview {
  cursor: pointer;
  transition: all 0.3s ease;
}

.map-preview:hover {
  opacity: 0.9;
}

@media (max-width: 960px) {
  .trip-header {
    height: 300px;
  }
}

/* Soporte para modo oscuro */
:deep(.v-theme--dark) {
  .traveler-card {
    background-color: rgba(255, 255, 255, 0.05);
  }
}
</style>