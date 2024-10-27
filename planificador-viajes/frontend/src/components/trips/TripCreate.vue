<template>
  <div class="trip-create">
    <!-- Header con navegación -->
    <v-card class="mb-6">
      <v-toolbar color="primary" prominent>
        <v-btn icon="mdi-arrow-left" variant="text" @click="$router.back()"></v-btn>
        <v-toolbar-title class="text-h5 font-weight-bold">
          Crear Nuevo Viaje
        </v-toolbar-title>
      </v-toolbar>
    </v-card>

    <!-- Formulario principal -->
    <v-form ref="form" v-model="isFormValid" @submit.prevent="handleSubmit">
      <v-row>
        <!-- Información básica -->
        <v-col cols="12" md="8">
          <v-card class="mb-6">
            <v-card-title class="text-h6 font-weight-bold">
              Información básica
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="tripData.title" label="Título del viaje" variant="outlined"
                    :rules="rules.title" required autofocus></v-text-field>
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
                      <v-btn color="error" variant="text" icon="mdi-delete" @click="removeTraveler(index)"
                        :disabled="index === 0"></v-btn>
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
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Botones de acción -->
      <v-row class="mt-6">
        <v-col>
          <v-card>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="tonal" color="error" @click="$router.back()" :disabled="loading">
                Cancelar
              </v-btn>
              <v-btn color="primary" :loading="loading" :disabled="!isFormValid" type="submit">
                Crear Viaje
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
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTripsStore } from '@/store/modules/trips'
import { useAppStore } from '@/store/modules/app'
import { format, addDays } from 'date-fns'
import { es } from 'date-fns/locale'

export default {
  name: 'TripCreate',

  setup() {
    const router = useRouter()
    const tripsStore = useTripsStore()
    const appStore = useAppStore()
    const form = ref(null)

    // Estado del formulario
    const isFormValid = ref(false)
    const loading = ref(false)
    const loadingDestinations = ref(false)
    const exitDialog = ref(false)
    const dateMenu = ref({ start: false, end: false })

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
        { name: '', email: '' } // Viajero principal
      ],
      privacy: 'private',
      notifications: true,
      shareLocation: false,
      budget: null,
      currency: 'USD'
    })

    // Opciones y datos estáticos
    const destinations = [
      { title: 'París, Francia', value: 'paris' },
      { title: 'Roma, Italia', value: 'roma' },
      { title: 'Barcelona, España', value: 'barcelona' }
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
        v => !!v || 'La fecha de inicio es requerida',
        v => new Date(v) >= new Date() || 'La fecha debe ser futura'
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

    // Métodos
    const handleStartDateSelect = (date) => {
      tripData.value.startDate = date
      tripData.value.formattedStartDate = format(new Date(date), 'dd MMM yyyy', { locale: es })

      // Si no hay fecha de fin o es anterior a la de inicio, ajustarla
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
      if (index !== 0) { // No permitir eliminar al viajero principal
        tripData.value.travelers.splice(index, 1)
      }
    }

    const handleSubmit = async () => {
      if (!form.value.validate()) return

      loading.value = true
      try {
        const newTrip = await tripsStore.createTrip({
          ...tripData.value,
          status: 'planificado',
          createdAt: new Date().toISOString()
        })

        appStore.showSnackbar({
          text: '¡Viaje creado exitosamente!',
          color: 'success'
        })

        // Redirigir a la vista de detalles del nuevo viaje
        router.push({
          name: 'TripDetails',
          params: { id: newTrip.id }
        })
      } catch (error) {
        console.error('Error al crear viaje:', error)
        appStore.showSnackbar({
          text: 'Error al crear el viaje. Por favor, intenta nuevamente.',
          color: 'error'
        })
      } finally {
        loading.value = false
      }
    }

    const checkUnsavedChanges = () => {
      return tripData.value.title ||
        tripData.value.destination ||
        tripData.value.startDate ||
        tripData.value.description ||
        tripData.value.travelers.length > 1 ||
        tripData.value.budget
    }

    const confirmExit = () => {
      exitDialog.value = false
      router.back()
    }

    // Router guards
    const beforeRouteLeave = (to, from, next) => {
      if (checkUnsavedChanges()) {
        exitDialog.value = true
        next(false)
      } else {
        next()
      }
    }

    // Lifecycle hooks
    const fetchDestinations = async () => {
      loadingDestinations.value = true
      try {
        // Aquí iría la llamada real a la API
        await new Promise(resolve => setTimeout(resolve, 1000))
        // const response = await axios.get('/api/destinations')
        // destinations.value = response.data
      } catch (error) {
        console.error('Error al cargar destinos:', error)
        appStore.showSnackbar({
          text: 'Error al cargar los destinos',
          color: 'error'
        })
      } finally {
        loadingDestinations.value = false
      }
    }

    onMounted(() => {
      fetchDestinations()
    })

    return {
      // Referencias
      form,

      // Estado
      isFormValid,
      loading,
      loadingDestinations,
      exitDialog,
      dateMenu,
      tripData,

      // Datos y opciones
      destinations,
      privacyOptions,
      currencyOptions,
      rules,

      // Métodos
      handleStartDateSelect,
      handleEndDateSelect,
      addTraveler,
      removeTraveler,
      handleSubmit,
      confirmExit,
      beforeRouteLeave
    }
  }
}
</script>

<style scoped>
.trip-create {
  min-height: calc(100vh - var(--navbar-height));
  padding: 24px;
  background-color: #f5f5f5;
}

.traveler-card {
  transition: all 0.3s ease;
  position: relative;
}

.traveler-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Estilos para días festivos en el date picker */
:deep(.v-date-picker-table__date--holiday) {
  color: var(--v-theme-error);
}

/* Mejoras visuales para los campos de formulario */
:deep(.v-text-field) {
  transition: all 0.3s ease;
}

:deep(.v-text-field:hover) {
  transform: translateY(-1px);
}

:deep(.v-text-field--focused) {
  transform: translateY(-2px);
}

/* Ajustes responsive */
@media (max-width: 960px) {
  .trip-create {
    padding: 16px;
  }
}

/* Animaciones */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

/* Soporte para modo oscuro */
:deep(.v-theme--dark) {
  .trip-create {
    background-color: #1e1e1e;
  }

  .traveler-card {
    background-color: #2d2d2d;
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