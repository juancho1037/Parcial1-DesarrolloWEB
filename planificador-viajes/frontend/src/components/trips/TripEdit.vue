<template>
  <div class="trip-edit">
    <!-- Header con navegación -->
    <v-card class="mb-6">
      <v-toolbar color="primary" prominent>
        <v-btn icon="mdi-arrow-left" variant="text" @click="handleBack"></v-btn>
        <v-toolbar-title class="text-h5 font-weight-bold">
          Editar Viaje
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- Botón de previsualización -->
        <v-btn prepend-icon="mdi-eye" variant="text" :loading="loading" @click="previewTrip">
          Previsualizar
        </v-btn>
      </v-toolbar>
    </v-card>

    <!-- Loading state -->
    <div v-if="initialLoading" class="d-flex justify-center align-center" style="min-height: 400px">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <!-- Error state -->
    <v-card v-else-if="loadError" class="error-state text-center pa-6">
      <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
      <h3 class="text-h5 font-weight-bold mb-2">
        Error al cargar el viaje
      </h3>
      <p class="text-body-1 text-medium-emphasis mb-4">
        No se pudo cargar la información del viaje. Por favor, intenta nuevamente.
      </p>
      <v-btn color="primary" @click="fetchTripData">
        Reintentar
      </v-btn>
    </v-card>

    <!-- Formulario de edición -->
    <v-form v-else ref="form" v-model="isFormValid" @submit.prevent="handleSubmit">
      <v-row>
        <!-- Información básica -->
        <v-col cols="12" md="8">
          <v-card class="mb-6">
            <v-card-title class="text-h6 font-weight-bold d-flex align-center">
              Información básica
              <v-chip :color="getStatusColor(tripData.status)" class="ml-4" size="small">
                {{ getStatusLabel(tripData.status) }}
              </v-chip>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="tripData.title" label="Título del viaje" variant="outlined"
                    :rules="rules.title" required></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-select v-model="tripData.destination" :items="destinations" label="Destino" variant="outlined"
                    :rules="rules.destination" required :loading="loadingDestinations" :disabled="loadingDestinations">
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-map-marker</v-icon>
                    </template>
                  </v-select>
                </v-col>

                <v-col cols="12" md="6">
                  <v-menu v-model="dateMenu.start" :close-on-content-click="false">
                    <template v-slot:activator="{ props }">
                      <v-text-field v-model="tripData.formattedStartDate" label="Fecha de inicio" variant="outlined"
                        readonly v-bind="props" :rules="rules.startDate" required>
                        <template v-slot:prepend>
                          <v-icon color="primary">mdi-calendar</v-icon>
                        </template>
                      </v-text-field>
                    </template>
                    <v-date-picker v-model="tripData.startDate"
                      @update:model-value="handleStartDateSelect"></v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12" md="6">
                  <v-menu v-model="dateMenu.end" :close-on-content-click="false">
                    <template v-slot:activator="{ props }">
                      <v-text-field v-model="tripData.formattedEndDate" label="Fecha de fin" variant="outlined" readonly
                        v-bind="props" :rules="rules.endDate" required>
                        <template v-slot:prepend>
                          <v-icon color="primary">mdi-calendar</v-icon>
                        </template>
                      </v-text-field>
                    </template>
                    <v-date-picker v-model="tripData.endDate" @update:model-value="handleEndDateSelect"
                      :min="tripData.startDate"></v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12">
                  <v-textarea v-model="tripData.description" label="Descripción" variant="outlined"
                    :rules="rules.description" rows="4"></v-textarea>
                </v-col>

                <v-col cols="12">
                  <v-select v-model="tripData.status" :items="statusOptions" label="Estado del viaje"
                    variant="outlined"></v-select>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Viajeros -->
          <v-card class="mb-6">
            <v-card-title class="text-h6 font-weight-bold d-flex align-center">
              Viajeros
              <v-spacer></v-spacer>
              <v-btn color="primary" variant="text" prepend-icon="mdi-plus" @click="addTraveler">
                Añadir viajero
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col v-for="(traveler, index) in tripData.travelers" :key="index" cols="12" sm="6">
                  <v-card variant="outlined" class="traveler-card">
                    <v-card-text>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field v-model="traveler.name" label="Nombre" variant="outlined" density="comfortable"
                            :rules="rules.travelerName"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field v-model="traveler.email" label="Email" variant="outlined" density="comfortable"
                            :rules="rules.email"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn v-if="index > 0" color="error" variant="text" icon="mdi-delete"
                        @click="removeTraveler(index)"></v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Panel lateral -->
        <v-col cols="12" md="4">
          <v-card class="mb-6">
            <v-card-title class="text-h6 font-weight-bold">
              Configuración
            </v-card-title>
            <v-card-text>
              <v-select v-model="tripData.privacy" :items="privacyOptions" label="Privacidad" variant="outlined"
                class="mb-4"></v-select>

              <v-switch v-model="tripData.notifications" label="Activar notificaciones" color="primary"
                class="mb-4"></v-switch>

              <v-switch v-model="tripData.shareLocation" label="Compartir ubicación" color="primary"></v-switch>
            </v-card-text>
          </v-card>

          <v-card>
            <v-card-title class="text-h6 font-weight-bold">
              Presupuesto estimado
            </v-card-title>
            <v-card-text>
              <v-text-field v-model.number="tripData.budget" label="Presupuesto total" variant="outlined" type="number"
                prefix="$" :rules="rules.budget"></v-text-field>

              <v-select v-model="tripData.currency" :items="currencyOptions" label="Moneda"
                variant="outlined"></v-select>

              <!-- Resumen de gastos si ya existen -->
              <v-list v-if="tripData.expenses?.length" density="compact" class="mt-4">
                <v-list-subheader>Gastos registrados</v-list-subheader>
                <v-list-item v-for="category in expensesSummary" :key="category.name" :subtitle="category.name">
                  <template v-slot:prepend>
                    <v-icon :color="category.color">{{ category.icon }}</v-icon>
                  </template>
                  <template v-slot:append>
                    {{ formatCurrency(category.total, tripData.currency) }}
                  </template>
                </v-list-item>
                <v-divider class="my-2"></v-divider>
                <v-list-item class="font-weight-bold">
                  <template v-slot:prepend>Total</template>
                  <template v-slot:append>
                    {{ formatCurrency(totalExpenses, tripData.currency) }}
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Botones de acción -->
      <v-row class="mt-6">
        <v-col>
          <v-card>
            <v-card-actions>
              <v-btn color="error" variant="text" @click="confirmDelete" :disabled="loading">
                Eliminar viaje
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn variant="tonal" @click="handleBack" :disabled="loading">
                Cancelar
              </v-btn>
              <v-btn color="primary" :loading="loading" :disabled="!isFormValid" type="submit">
                Guardar cambios
                <v-icon end>mdi-check</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-form>

    <!-- Diálogo de confirmación de salida -->
    <v-dialog v-model="exitDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          ¿Descartar cambios?
        </v-card-title>
        <v-card-text>
          Los cambios no guardados se perderán. ¿Estás seguro de que deseas salir?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="exitDialog = false">
            Continuar editando
          </v-btn>
          <v-btn color="error" variant="tonal" @click="confirmExit">
            Descartar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación de eliminación -->
    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          ¿Eliminar viaje?
        </v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar este viaje? Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="deleteDialog = false">
            Cancelar
          </v-btn>
          <v-btn color="error" variant="tonal" :loading="loading" @click="handleDelete">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTripsStore } from '@/store/modules/trips'
import { useAppStore } from '@/store/modules/app'
import { format, addDays } from 'date-fns'
import { es } from 'date-fns/locale'

export default {
  name: 'TripEdit',

  setup() {
    const router = useRouter()
    const route = useRoute()
    const tripsStore = useTripsStore()
    const appStore = useAppStore()
    const form = ref(null)

    // Estado
    const initialLoading = ref(true)
    const loadError = ref(false)
    const loading = ref(false)
    const loadingDestinations = ref(false)
    const isFormValid = ref(false)
    const exitDialog = ref(false)
    const deleteDialog = ref(false)
    const dateMenu = ref({ start: false, end: false })
    const originalData = ref(null)

    // Datos del viaje
    const tripData = ref({
      title: '',
      destination: null,
      startDate: '',
      endDate: '',
      formattedStartDate: '',
      formattedEndDate: '',
      description: '',
      travelers: [
        { name: '', email: '' }
      ],
      privacy: 'private',
      notifications: true,
      shareLocation: false,
      budget: null,
      currency: 'USD',
      status: 'planificado',
      expenses: []
    })

    // Opciones y datos estáticos
    const destinations = [
      { title: 'París, Francia', value: 'paris' },
      { title: 'Roma, Italia', value: 'roma' },
      { title: 'Barcelona, España', value: 'barcelona' }
    ]

    const statusOptions = [
      { title: 'Planificado', value: 'planificado' },
      { title: 'En progreso', value: 'en-progreso' },
      { title: 'Completado', value: 'completado' },
      { title: 'Cancelado', value: 'cancelado' }
    ]

    const privacyOptions = [
      { title: 'Privado', value: 'private' },
      { title: 'Solo amigos', value: 'friends' },
      { title: 'Público', value: 'public' }
    ]

    const currencyOptions = [
      { title: 'USD - Dólar estadounidense', value: 'USD' },
      { title: 'EUR - Euro', value: 'EUR' },
      { title: 'COP - Peso colombiano', value: 'COP' }
    ]

    // Computed properties
    const expensesSummary = computed(() => {
      if (!tripData.value.expenses?.length) return []

      const categories = {}
      tripData.value.expenses.forEach(expense => {
        if (!categories[expense.category]) {
          categories[expense.category] = {
            name: expense.category,
            total: 0,
            icon: getCategoryIcon(expense.category),
            color: getCategoryColor(expense.category)
          }
        }
        categories[expense.category].total += expense.amount
      })

      return Object.values(categories)
    })

    const totalExpenses = computed(() => {
      if (!tripData.value.expenses?.length) return 0
      return tripData.value.expenses.reduce((total, expense) => total + expense.amount, 0)
    })

    const hasUnsavedChanges = computed(() => {
      if (!originalData.value) return false
      return JSON.stringify(originalData.value) !== JSON.stringify(tripData.value)
    })

    // Reglas de validación
    const rules = {
      title: [
        v => !!v || 'El título es requerido',
        v => v.length >= 3 || 'El título debe tener al menos 3 caracteres',
        v => v.length <= 50 || 'El título no puede tener más de 50 caracteres'
      ],
      destination: [
        v => !!v || 'El destino es requerido'
      ],
      startDate: [
        v => !!v || 'La fecha de inicio es requerida'
      ],
      endDate: [
        v => !!v || 'La fecha de fin es requerida',
        v => !tripData.value.startDate || new Date(v) >= new Date(tripData.value.startDate) || 'La fecha de fin debe ser posterior a la de inicio'
      ],
      description: [
        v => !v || v.length <= 500 || 'La descripción no puede tener más de 500 caracteres'
      ],
      travelerName: [
        v => !!v || 'El nombre es requerido',
        v => v.length >= 2 || 'El nombre debe tener al menos 2 caracteres'
      ],
      email: [
        v => !v || /.+@.+\..+/.test(v) || 'Email debe ser válido'
      ],
      budget: [
        v => !v || v >= 0 || 'El presupuesto debe ser un valor positivo'
      ]
    }

    // Métodos de utilidad
    const formatCurrency = (amount, currency) => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: currency
      }).format(amount)
    }

    const getCategoryIcon = (category) => {
      const icons = {
        'alojamiento': 'mdi-hotel',
        'transporte': 'mdi-airplane',
        'comida': 'mdi-food',
        'actividades': 'mdi-ticket',
        'otros': 'mdi-dots-horizontal'
      }
      return icons[category] || 'mdi-circle'
    }

    const getCategoryColor = (category) => {
      const colors = {
        'alojamiento': 'blue',
        'transporte': 'green',
        'comida': 'orange',
        'actividades': 'purple',
        'otros': 'grey'
      }
      return colors[category] || 'primary'
    }

    const getStatusColor = (status) => {
      const colors = {
        'planificado': 'info',
        'en-progreso': 'warning',
        'completado': 'success',
        'cancelado': 'error'
      }
      return colors[status] || 'grey'
    }

    const getStatusLabel = (status) => {
      return statusOptions.find(opt => opt.value === status)?.title || status
    }

    // Métodos de manejo de fechas
    const handleStartDateSelect = (date) => {
      tripData.value.startDate = date
      tripData.value.formattedStartDate = format(new Date(date), 'dd MMM yyyy', { locale: es })

      if (!tripData.value.endDate || new Date(tripData.value.endDate) <= new Date(date)) {
        const nextDay = addDays(new Date(date), 1)
        tripData.value.endDate = format(nextDay, 'yyyy-MM-dd')
        tripData.value.formattedEndDate = format(nextDay, 'dd MMM yyyy', { locale: es })
      }

      dateMenu.value.start = false
    }

    const handleEndDateSelect = (date) => {
      tripData.value.endDate = date
      tripData.value.formattedEndDate = format(new Date(date), 'dd MMM yyyy', { locale: es })
      dateMenu.value.end = false
    }

    // Métodos de gestión de viajeros
    const addTraveler = () => {
      if (tripData.value.travelers.length < 10) {
        tripData.value.travelers.push({ name: '', email: '' })
      } else {
        appStore.showSnackbar({
          text: 'Se ha alcanzado el límite máximo de viajeros',
          color: 'warning'
        })
      }
    }

    const removeTraveler = (index) => {
      if (index !== 0) {
        tripData.value.travelers.splice(index, 1)
      }
    }

    // Métodos principales
    const fetchTripData = async () => {
      initialLoading.value = true
      loadError.value = false

      try {
        const tripId = route.params.id
        const trip = await tripsStore.getTripById(tripId)

        if (!trip) {
          throw new Error('Viaje no encontrado')
        }

        // Formatear fechas
        trip.formattedStartDate = format(new Date(trip.startDate), 'dd MMM yyyy', { locale: es })
        trip.formattedEndDate = format(new Date(trip.endDate), 'dd MMM yyyy', { locale: es })

        tripData.value = { ...trip }
        originalData.value = JSON.parse(JSON.stringify(trip))
      } catch (error) {
        console.error('Error al cargar el viaje:', error)
        loadError.value = true
        appStore.showSnackbar({
          text: 'Error al cargar la información del viaje',
          color: 'error'
        })
      } finally {
        initialLoading.value = false
      }
    }

    const handleSubmit = async () => {
      if (!form.value.validate()) return

      loading.value = true
      try {
        await tripsStore.updateTrip({
          id: route.params.id,
          ...tripData.value,
          updatedAt: new Date().toISOString()
        })

        appStore.showSnackbar({
          text: 'Viaje actualizado exitosamente',
          color: 'success'
        })

        originalData.value = JSON.parse(JSON.stringify(tripData.value))
        router.push({ name: 'TripDetails', params: { id: route.params.id } })
      } catch (error) {
        console.error('Error al actualizar viaje:', error)
        appStore.showSnackbar({
          text: 'Error al actualizar el viaje',
          color: 'error'
        })
      } finally {
        loading.value = false
      }
    }

    const handleDelete = async () => {
      loading.value = true
      try {
        await tripsStore.deleteTrip(route.params.id)

        appStore.showSnackbar({
          text: 'Viaje eliminado exitosamente',
          color: 'success'
        })

        router.push({ name: 'TripList' })
      } catch (error) {
        console.error('Error al eliminar viaje:', error)
        appStore.showSnackbar({
          text: 'Error al eliminar el viaje',
          color: 'error'
        })
      } finally {
        loading.value = false
        deleteDialog.value = false
      }
    }

    const handleBack = () => {
      if (hasUnsavedChanges.value) {
        exitDialog.value = true
      } else {
        router.back()
      }
    }

    const confirmExit = () => {
      exitDialog.value = false
      router.back()
    }

    const confirmDelete = () => {
      deleteDialog.value = true
    }

    const previewTrip = () => {
      // Guardar estado actual en el store
      tripsStore.setPreviewData(tripData.value)
      // Navegar a la vista de detalles en modo preview
      router.push({
        name: 'TripPreview',
        params: { id: route.params.id }
      })
    }

    // Lifecycle hooks
    onMounted(() => {
      fetchTripData()
    })

    return {
      // Referencias
      form,

      // Estado
      initialLoading,
      loadError,
      loading,
      loadingDestinations,
      isFormValid,
      exitDialog,
      deleteDialog,
      dateMenu,
      tripData,

      // Opciones y datos
      destinations,
      statusOptions,
      privacyOptions,
      currencyOptions,
      rules,
      expensesSummary,
      totalExpenses,

      // Métodos
      formatCurrency,
      getCategoryColor,
      getStatusColor,
      getStatusLabel,
      handleStartDateSelect,
      handleEndDateSelect,
      addTraveler,
      removeTraveler,
      handleSubmit,
      handleBack,
      confirmExit,
      confirmDelete,
      handleDelete,
      previewTrip,
      fetchTripData
    }
  }
}
</script>

<style scoped>
.trip-edit {
  min-height: calc(100vh - var(--navbar-height));
  padding: 24px;
  background-color: #f5f5f5;
}

.error-state {
  max-width: 500px;
  margin: 0 auto;
}

.traveler-card {
  transition: all 0.3s ease;
  position: relative;
}

.traveler-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.v-text-field) {
  transition: all 0.3s ease;
}

:deep(.v-text-field:hover) {
  transform: translateY(-1px);
}

@media (max-width: 960px) {
  .trip-edit {
    padding: 16px;
  }
}

/* Soporte para modo oscuro */
:deep(.v-theme--dark) {
  .trip-edit {
    background-color: #1e1e1e;
  }
}

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
</style>