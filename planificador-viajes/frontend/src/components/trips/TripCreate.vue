<template>
  <div class="trip-create pa-6">
    <!-- Header mejorado -->
    <v-card class="header-card mb-6" elevation="2" rounded="lg">
      <v-toolbar color="primary" prominent flat>
        <v-btn icon="mdi-arrow-left" variant="text" color="white" @click="$router.back()"></v-btn>
        <v-toolbar-title>
          <h1 class="text-h5 font-weight-bold text-white">Crear Nuevo Viaje</h1>
        </v-toolbar-title>
      </v-toolbar>
    </v-card>

    <!-- Contenido principal -->
    <v-row>
      <!-- Columna izquierda - Información básica -->
      <v-col cols="12" md="8">
        <v-card class="mb-6" elevation="2" rounded="lg">
          <v-card-title class="d-flex align-center pa-4 bg-primary-lighten-5">
            <v-icon color="primary" size="24" class="mr-2">mdi-information</v-icon>
            <span class="text-h6 font-weight-bold">Información básica</span>
          </v-card-title>

          <v-card-text class="pa-4">
            <v-form @submit.prevent="handleSubmit" ref="form">
              <!-- Título del viaje -->
              <v-text-field v-model="tripData.title" label="Título del viaje" variant="outlined" :rules="rules.title"
                required prepend-inner-icon="mdi-format-title" placeholder="Ej: Vacaciones en París" class="mb-4"
                hide-details="auto"></v-text-field>

              <!-- Destino -->
              <v-select v-model="tripData.destination" :items="destinations" label="Destino" variant="outlined"
                :rules="rules.destination" required prepend-inner-icon="mdi-map-marker"
                placeholder="Selecciona un destino" class="mb-4" hide-details="auto"></v-select>

              <!-- Fechas -->
              <v-row>
                <v-col cols="12" md="6">
                  <v-menu v-model="dateMenu.start" :close-on-content-click="false">
                    <template v-slot:activator="{ props }">
                      <v-text-field v-model="tripData.formattedStartDate" label="Fecha de inicio" variant="outlined"
                        readonly v-bind="props" :rules="rules.startDate" required
                        prepend-inner-icon="mdi-calendar-start" class="mb-4" hide-details="auto"></v-text-field>
                    </template>
                    <v-date-picker v-model="tripData.startDate" @update:model-value="handleStartDateSelect"
                      :min="minDate" color="primary"></v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12" md="6">
                  <v-menu v-model="dateMenu.end" :close-on-content-click="false">
                    <template v-slot:activator="{ props }">
                      <v-text-field v-model="tripData.formattedEndDate" label="Fecha de fin" variant="outlined" readonly
                        v-bind="props" :rules="rules.endDate" required prepend-inner-icon="mdi-calendar-end"
                        class="mb-4" hide-details="auto"></v-text-field>
                    </template>
                    <v-date-picker v-model="tripData.endDate" @update:model-value="handleEndDateSelect"
                      :min="tripData.startDate || minDate" color="primary"></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>

              <!-- Descripción -->
              <v-textarea v-model="tripData.description" label="Descripción" variant="outlined"
                :rules="rules.description" rows="4" prepend-inner-icon="mdi-text" placeholder="Describe tu viaje..."
                class="mb-4" hide-details="auto"></v-textarea>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Columna derecha - Configuración -->
      <v-col cols="12" md="4">
        <v-card elevation="2" rounded="lg" class="config-card">
          <v-card-title class="d-flex align-center pa-4 bg-primary-lighten-5">
            <v-icon color="primary" size="24" class="mr-2">mdi-cog</v-icon>
            <span class="text-h6 font-weight-bold">Configuración</span>
          </v-card-title>

          <v-card-text class="pa-4">
            <!-- Privacidad -->
            <v-select v-model="tripData.privacy" :items="privacyOptions" label="Privacidad" variant="outlined"
              prepend-inner-icon="mdi-shield-account" class="mb-4" hide-details="auto"></v-select>

            <!-- Notificaciones -->
            <v-switch v-model="tripData.notifications" color="primary" hide-details class="mb-4">
              <template v-slot:label>
                <div class="d-flex align-center">
                  <v-icon size="20" class="mr-2">mdi-bell</v-icon>
                  Activar notificaciones
                </div>
              </template>
            </v-switch>
          </v-card-text>
        </v-card>

        <!-- Botones de acción -->
        <v-card class="mt-6" elevation="2" rounded="lg">
          <v-card-text class="pa-4">
            <v-btn color="primary" block size="large" type="submit" :loading="loading" :disabled="!isFormValid"
              @click="handleSubmit" class="mb-3" elevation="2">
              <v-icon left class="mr-2">mdi-check</v-icon>
              Crear Viaje
            </v-btn>

            <v-btn variant="outlined" block size="large" @click="$router.back()" :disabled="loading">
              <v-icon left class="mr-2">mdi-close</v-icon>
              Cancelar
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTripsStore } from '@/store/modules/trips'
import { useAppStore } from '@/store/modules/app'
import { format, parse, addDays } from 'date-fns'
import { es } from 'date-fns/locale'

export default {
  name: 'TripCreate',

  setup() {
    const router = useRouter()
    const tripsStore = useTripsStore()
    const appStore = useAppStore()
    const form = ref(null)

    // Estado
    const loading = ref(false)
    const isFormValid = ref(false)
    const dateMenu = reactive({
      start: false,
      end: false
    })

    // Fecha mínima (hoy)
    const minDate = computed(() => {
      return format(new Date(), 'yyyy-MM-dd')
    })

    // Datos del viaje
    const tripData = reactive({
      title: '',
      destination: null,
      startDate: null,
      endDate: null,
      formattedStartDate: '',
      formattedEndDate: '',
      description: '',
      privacy: 'private',
      notifications: true
    })

    // Reglas de validación
    const rules = {
      title: [
        v => !!v || 'El título es requerido',
        v => v.length >= 3 || 'El título debe tener al menos 3 caracteres'
      ],
      destination: [
        v => !!v || 'El destino es requerido'
      ],
      startDate: [
        v => !!v || 'La fecha de inicio es requerida',
        v => {
          if (!v) return true
          const date = parse(v, 'dd MMM yyyy', new Date())
          return date >= new Date() || 'La fecha debe ser futura'
        }
      ],
      endDate: [
        v => !!v || 'La fecha de fin es requerida',
        v => {
          if (!v || !tripData.startDate) return true
          const endDate = parse(v, 'dd MMM yyyy', new Date())
          const startDate = parse(tripData.formattedStartDate, 'dd MMM yyyy', new Date())
          return endDate >= startDate || 'La fecha de fin debe ser posterior a la de inicio'
        }
      ],
      description: [
        v => !v || v.length <= 500 || 'La descripción es demasiado larga'
      ]
    }

    // Métodos para manejo de fechas
    const handleStartDateSelect = (date) => {
      if (!date) return

      tripData.startDate = date
      tripData.formattedStartDate = format(new Date(date), 'dd MMM yyyy', { locale: es })
      dateMenu.start = false

      // Si la fecha de fin es anterior a la de inicio, la actualizamos
      if (tripData.endDate) {
        const endDate = new Date(tripData.endDate)
        const startDate = new Date(date)
        if (endDate < startDate) {
          const newEndDate = addDays(startDate, 1)
          tripData.endDate = format(newEndDate, 'yyyy-MM-dd')
          tripData.formattedEndDate = format(newEndDate, 'dd MMM yyyy', { locale: es })
        }
      }
    }

    const handleEndDateSelect = (date) => {
      if (!date) return

      tripData.endDate = date
      tripData.formattedEndDate = format(new Date(date), 'dd MMM yyyy', { locale: es })
      dateMenu.end = false
    }

    // Método para enviar el formulario
    const handleSubmit = async () => {
      if (!form.value.validate()) return

      loading.value = true
      try {
        // Formatear fechas para el backend
        const tripDataToSend = {
          ...tripData,
          startDate: format(new Date(tripData.startDate), 'yyyy-MM-dd'),
          endDate: format(new Date(tripData.endDate), 'yyyy-MM-dd'),
        }

        await tripsStore.createTrip(tripDataToSend)

        appStore.showSnackbar({
          text: 'Viaje creado exitosamente',
          color: 'success'
        })

        router.push({ name: 'Trips' })
      } catch (error) {
        console.error('Error al crear viaje:', error)
        appStore.showSnackbar({
          text: 'Error al crear el viaje',
          color: 'error'
        })
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      isFormValid,
      dateMenu,
      tripData,
      minDate,
      rules,
      handleStartDateSelect,
      handleEndDateSelect,
      handleSubmit,
      // Opciones estáticas
      destinations: [
        { title: 'París, Francia', value: 'paris' },
        { title: 'Roma, Italia', value: 'roma' },
        { title: 'Barcelona, España', value: 'barcelona' }
      ],
      privacyOptions: [
        { title: 'Privado', value: 'private' },
        { title: 'Solo amigos', value: 'friends' },
        { title: 'Público', value: 'public' }
      ]
    }
  }
}
</script>

<style scoped>
.trip-create {
  background-color: #f5f7fa;
  min-height: calc(100vh - 64px);
  /* Ajustar según la altura de tu Navbar */
}

.header-card {
  background: linear-gradient(135deg, var(--v-primary-base), var(--v-primary-darken1));
}

.header-card .v-toolbar {
  border-radius: 8px;
}

/* Estilos para las tarjetas */
.v-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1) !important;
}

/* Estilos para los campos de formulario */
:deep(.v-field) {
  border-radius: 8px !important;
  transition: all 0.3s ease;
}

:deep(.v-field:hover) {
  border-color: var(--v-primary-base);
}

:deep(.v-field--focused) {
  border-color: var(--v-primary-base);
  box-shadow: 0 0 0 2px rgba(var(--v-primary-base), 0.1);
}

/* Estilos para los botones */
.v-btn {
  letter-spacing: 0.5px;
  font-weight: 600;
  text-transform: none;
}

/* Estilos para el date picker */
:deep(.v-date-picker) {
  border-radius: 8px;
  overflow: hidden;
}

/* Responsive */
@media (max-width: 960px) {
  .trip-create {
    padding: 16px;
  }
}
</style>