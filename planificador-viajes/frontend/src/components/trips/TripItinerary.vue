<template>
  <div class="trip-itinerary">
    <!-- Header -->
    <v-card class="mb-6">
      <v-toolbar color="primary" prominent>
        <v-btn icon="mdi-arrow-left" variant="text" @click="$router.back()"></v-btn>
        <v-toolbar-title class="text-h5 font-weight-bold">
          Itinerario del Viaje
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-calendar-export" variant="text" @click="exportItinerary" :loading="exporting"></v-btn>
        <v-btn icon="mdi-dots-vertical" variant="text" @click="showOptionsMenu = true"></v-btn>
      </v-toolbar>

      <!-- Subheader con información del viaje -->
      <v-card-text class="py-4">
        <v-row align="center">
          <v-col cols="12" sm="6" md="4">
            <div class="text-h6 font-weight-bold">{{ trip?.title }}</div>
            <div class="text-subtitle-1 text-medium-emphasis">
              <v-icon start size="small">mdi-map-marker</v-icon>
              {{ trip?.destination }}
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="4" class="text-center">
            <div class="text-body-1">
              <v-icon start size="small">mdi-calendar</v-icon>
              {{ formatDateRange(trip?.startDate, trip?.endDate) }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{ getTotalDays }} días
            </div>
          </v-col>
          <v-col cols="12" md="4" class="text-md-right">
            <v-btn color="primary" variant="text" prepend-icon="mdi-plus" @click="addActivity">
              Agregar Actividad
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading state -->
    <div v-if="loading" class="d-flex justify-center align-center" style="min-height: 400px">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <!-- Error state -->
    <v-card v-else-if="error" class="error-state text-center pa-6">
      <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
      <h3 class="text-h5 font-weight-bold mb-2">Error al cargar el itinerario</h3>
      <p class="text-body-1 text-medium-emphasis mb-4">
        No se pudo cargar la información del itinerario. Por favor, intenta nuevamente.
      </p>
      <v-btn color="primary" @click="fetchItinerary">Reintentar</v-btn>
    </v-card>

    <!-- Contenido principal -->
    <template v-else>
      <v-container fluid>
        <v-row>
          <!-- Vista de calendario -->
          <v-col cols="12" md="3">
            <v-card>
              <v-date-picker v-model="selectedDate" :min="trip?.startDate" :max="trip?.endDate"
                :disabled-dates="nonTripDates" width="100%" @update:model-value="scrollToDate">
                <template v-slot:day="{ date }">
                  <div class="date-cell" :class="getDateClass(date)">
                    {{ new Date(date).getDate() }}
                    <div class="activity-dots">
                      <span v-for="(dot, index) in getActivityDots(date)" :key="index" class="dot"
                        :style="{ backgroundColor: dot.color }"></span>
                    </div>
                  </div>
                </template>
              </v-date-picker>
            </v-card>
          </v-col>

          <!-- Vista detallada del itinerario -->
          <v-col cols="12" md="9">
            <div class="itinerary-days" ref="daysContainer">
              <div v-for="day in itineraryDays" :key="day.date" :id="`day-${day.date}`" class="day-section mb-6">
                <div class="day-header d-flex align-center mb-4">
                  <div>
                    <h3 class="text-h6 font-weight-bold mb-1">
                      {{ formatDate(day.date, 'EEEE d MMMM') }}
                    </h3>
                    <div class="text-body-2 text-medium-emphasis">
                      Día {{ getDayNumber(day.date) }} de {{ getTotalDays }}
                    </div>
                  </div>
                  <v-spacer></v-spacer>
                  <v-btn variant="text" color="primary" size="small" prepend-icon="mdi-plus"
                    @click="addActivity(day.date)">
                    Agregar
                  </v-btn>
                </div>

                <!-- Lista de actividades del día -->
                <div class="activities-list">
                  <v-timeline density="comfortable" align="start">
                    <v-timeline-item v-for="activity in day.activities" :key="activity.id"
                      :dot-color="getCategoryColor(activity.category)" size="small" :fillDot="true">
                      <template v-slot:opposite>
                        {{ formatTime(activity.startTime) }}
                      </template>

                      <v-card :class="['activity-card', { 'activity-completed': activity.completed }]"
                        variant="outlined">
                        <v-card-text>
                          <div class="d-flex align-center mb-2">
                            <div>
                              <div class="text-subtitle-1 font-weight-medium">
                                {{ activity.title }}
                              </div>
                              <div class="text-body-2 text-medium-emphasis">
                                {{ activity.location }}
                              </div>
                            </div>
                            <v-spacer></v-spacer>
                            <v-checkbox v-model="activity.completed" hide-details density="compact"
                              @change="updateActivity(activity)"></v-checkbox>
                          </div>

                          <div class="text-body-2 mb-2">
                            {{ activity.description }}
                          </div>

                          <div class="d-flex align-center">
                            <v-chip :color="getCategoryColor(activity.category)" size="small" label class="mr-2">
                              {{ activity.category }}
                            </v-chip>

                            <v-chip v-if="activity.cost" size="small" label color="success">
                              {{ formatCurrency(activity.cost) }}
                            </v-chip>

                            <v-spacer></v-spacer>

                            <v-btn icon="mdi-pencil" variant="text" density="comfortable" size="small"
                              @click="editActivity(activity)"></v-btn>
                            <v-btn icon="mdi-delete" variant="text" density="comfortable" size="small" color="error"
                              @click="confirmDeleteActivity(activity)"></v-btn>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-timeline-item>

                    <!-- Estado vacío para días sin actividades -->
                    <v-timeline-item v-if="!day.activities.length" dot-color="grey" size="small">
                      <v-card variant="outlined" class="empty-day">
                        <v-card-text class="text-center">
                          <v-icon color="grey-lighten-1" size="40" class="mb-2">mdi-calendar-blank</v-icon>
                          <div class="text-body-2 text-medium-emphasis">
                            No hay actividades planificadas
                          </div>
                          <v-btn color="primary" variant="text" class="mt-2" @click="addActivity(day.date)">
                            Agregar actividad
                          </v-btn>
                        </v-card-text>
                      </v-card>
                    </v-timeline-item>
                  </v-timeline>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <!-- Diálogo para agregar/editar actividad -->
      <v-dialog v-model="activityDialog.show" max-width="600" persistent>
        <v-card>
          <v-card-title class="text-h5">
            {{ activityDialog.mode === 'edit' ? 'Editar' : 'Nueva' }} Actividad
          </v-card-title>
          <v-card-text>
            <v-form ref="activityForm">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="activityDialog.data.title" label="Título" variant="outlined"
                    :rules="rules.title"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field v-model="activityDialog.data.location" label="Ubicación" variant="outlined"
                    :rules="rules.location"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select v-model="activityDialog.data.category" :items="categoryOptions" label="Categoría"
                    variant="outlined" :rules="rules.category"></v-select>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field v-model="activityDialog.data.startTime" label="Hora de inicio" type="time"
                    variant="outlined" :rules="rules.time"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field v-model="activityDialog.data.cost" label="Costo" type="number" variant="outlined"
                    prefix="$"></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-textarea v-model="activityDialog.data.description" label="Descripción" variant="outlined" rows="3"
                    :rules="rules.description"></v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey-darken-1" variant="text" @click="closeActivityDialog">
              Cancelar
            </v-btn>
            <v-btn color="primary" :loading="activityDialog.loading" @click="saveActivity">
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Menú de opciones -->
      <v-menu v-model="showOptionsMenu" :close-on-content-click="false" location="end">
        <v-list>
          <v-list-item v-for="option in itineraryOptions" :key="option.value" :value="option.value"
            :title="option.title" :prepend-icon="option.icon" @click="handleOptionSelect(option.value)"></v-list-item>
        </v-list>
      </v-menu>

      <!-- Diálogo de confirmación de eliminación -->
      <v-dialog v-model="deleteDialog.show" max-width="500">
        <v-card>
          <v-card-title class="text-h5">
            ¿Eliminar actividad?
          </v-card-title>
          <v-card-text>
            ¿Estás seguro de que deseas eliminar la actividad "{{ deleteDialog.activity?.title }}"?
            Esta acción no se puede deshacer.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey-darken-1" variant="text" @click="deleteDialog.show = false">
              Cancelar
            </v-btn>
            <v-btn color="error" variant="tonal" :loading="deleteDialog.loading" @click="deleteActivity">
              Eliminar
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
import { format, eachDayOfInterval, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'

export default {
  name: 'TripItinerary',

  setup() {
    const router = useRouter()
    const route = useRoute()
    const tripsStore = useTripsStore()
    const appStore = useAppStore()
    const activityForm = ref(null)
    const daysContainer = ref(null)

    // Estado
    const loading = ref(true)
    const error = ref(false)
    const exporting = ref(false)
    const trip = ref(null)
    const selectedDate = ref(null)
    const showOptionsMenu = ref(false)

    // Diálogo de actividad
    const activityDialog = ref({
      show: false,
      mode: 'create',
      loading: false,
      data: {
        title: '',
        location: '',
        category: '',
        startTime: '',
        cost: null,
        description: '',
        date: null
      }
    })

    // Diálogo de eliminación
    const deleteDialog = ref({
      show: false,
      loading: false,
      activity: null
    })

    // Opciones y configuración
    const categoryOptions = [
      { title: 'Turismo', value: 'turismo' },
      { title: 'Gastronomía', value: 'gastronomia' },
      { title: 'Transporte', value: 'transporte' },
      { title: 'Alojamiento', value: 'alojamiento' },
      { title: 'Actividad', value: 'actividad' },
      { title: 'Otro', value: 'otro' }
    ]

    const itineraryOptions = [
      { title: 'Exportar a PDF', value: 'export_pdf', icon: 'mdi-file-pdf-box' },
      { title: 'Exportar a calendario', value: 'export_calendar', icon: 'mdi-calendar-export' },
      { title: 'Imprimir itinerario', value: 'print', icon: 'mdi-printer' },
      { title: 'Reordenar actividades', value: 'reorder', icon: 'mdi-sort' }
    ]

    // Reglas de validación
    const rules = {
      title: [
        v => !!v || 'El título es requerido',
        v => v.length <= 100 || 'El título es demasiado largo'
      ],
      location: [
        v => !!v || 'La ubicación es requerida'
      ],
      category: [
        v => !!v || 'La categoría es requerida'
      ],
      time: [
        v => !v || /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v) || 'Hora inválida'
      ],
      description: [
        v => !v || v.length <= 500 || 'La descripción es demasiado larga'
      ]
    }

    // Computed properties
    const itineraryDays = computed(() => {
      if (!trip.value) return []

      const days = eachDayOfInterval({
        start: new Date(trip.value.startDate),
        end: new Date(trip.value.endDate)
      })

      return days.map(date => {
        const dateStr = format(date, 'yyyy-MM-dd')
        return {
          date: dateStr,
          activities: (trip.value.activities || [])
            .filter(activity => activity.date === dateStr)
            .sort((a, b) => a.startTime?.localeCompare(b.startTime))
        }
      })
    })

    const getTotalDays = computed(() => {
      if (!trip.value?.startDate || !trip.value?.endDate) return 0
      return differenceInDays(
        new Date(trip.value.endDate),
        new Date(trip.value.startDate)
      ) + 1
    })

    const nonTripDates = computed(() => {
      return (date) => {
        const current = new Date(date)
        const start = new Date(trip.value?.startDate)
        const end = new Date(trip.value?.endDate)
        return current < start || current > end
      }
    })

    // Métodos
    const fetchItinerary = async () => {
      loading.value = true
      error.value = false

      try {
        const tripData = await tripsStore.getTripById(route.params.id)
        if (!tripData) throw new Error('Viaje no encontrado')

        trip.value = tripData
        selectedDate.value = tripData.startDate
      } catch (err) {
        console.error('Error al cargar itinerario:', err)
        error.value = true
        appStore.showSnackbar({
          text: 'Error al cargar el itinerario',
          color: 'error'
        })
      } finally {
        loading.value = false
      }
    }

    const addActivity = (date) => {
      activityDialog.value = {
        show: true,
        mode: 'create',
        loading: false,
        data: {
          title: '',
          location: '',
          category: '',
          startTime: '',
          cost: null,
          description: '',
          date: date || selectedDate.value
        }
      }
    }

    const editActivity = (activity) => {
      activityDialog.value = {
        show: true,
        mode: 'edit',
        loading: false,
        data: { ...activity }
      }
    }

    const saveActivity = async () => {
      if (!activityForm.value.validate()) return

      activityDialog.value.loading = true
      try {
        if (activityDialog.value.mode === 'create') {
          await tripsStore.addActivity({
            tripId: route.params.id,
            activity: activityDialog.value.data
          })
        } else {
          await tripsStore.updateActivity({
            tripId: route.params.id,
            activityId: activityDialog.value.data.id,
            activity: activityDialog.value.data
          })
        }

        appStore.showSnackbar({
          text: `Actividad ${activityDialog.value.mode === 'create' ? 'creada' : 'actualizada'} exitosamente`,
          color: 'success'
        })

        closeActivityDialog()
        await fetchItinerary()
      } catch (error) {
        console.error('Error al guardar actividad:', error)
        appStore.showSnackbar({
          text: 'Error al guardar la actividad',
          color: 'error'
        })
      } finally {
        activityDialog.value.loading = false
      }
    }

    const confirmDeleteActivity = (activity) => {
      deleteDialog.value = {
        show: true,
        loading: false,
        activity
      }
    }

    const deleteActivity = async () => {
      if (!deleteDialog.value.activity) return

      deleteDialog.value.loading = true
      try {
        await tripsStore.deleteActivity({
          tripId: route.params.id,
          activityId: deleteDialog.value.activity.id
        })

        appStore.showSnackbar({
          text: 'Actividad eliminada exitosamente',
          color: 'success'
        })

        deleteDialog.value.show = false
        await fetchItinerary()
      } catch (error) {
        console.error('Error al eliminar actividad:', error)
        appStore.showSnackbar({
          text: 'Error al eliminar la actividad',
          color: 'error'
        })
      } finally {
        deleteDialog.value.loading = false
      }
    }

    const scrollToDate = (date) => {
      const element = document.getElementById(`day-${date}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }

    const getDayNumber = (date) => {
      return differenceInDays(new Date(date), new Date(trip.value.startDate)) + 1
    }

    const getDateClass = (date) => {
      const activities = trip.value?.activities.filter(a => a.date === date) || []
      return {
        'has-activities': activities.length > 0,
        'selected-date': date === selectedDate.value
      }
    }

    const getActivityDots = (date) => {
      return (trip.value?.activities || [])
        .filter(a => a.date === date)
        .map(a => ({
          color: getCategoryColor(a.category)
        }))
        .slice(0, 3) // Máximo 3 puntos
    }

    const formatDate = (date, format = 'dd/MM/yyyy') => {
      return format(new Date(date), format, { locale: es })
    }

    const formatTime = (time) => {
      if (!time) return ''
      return time.substring(0, 5) // HH:mm
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
      }).format(amount)
    }

    const getCategoryColor = (category) => {
      const colors = {
        'turismo': 'blue',
        'gastronomia': 'orange',
        'transporte': 'green',
        'alojamiento': 'purple',
        'actividad': 'red',
        'otro': 'grey'
      }
      return colors[category] || 'grey'
    }

    const exportItinerary = async () => {
      exporting.value = true
      try {
        // Lógica de exportación
        await new Promise(resolve => setTimeout(resolve, 1000))
        appStore.showSnackbar({
          text: 'Itinerario exportado exitosamente',
          color: 'success'
        })
      } catch (error) {
        console.error('Error al exportar:', error)
        appStore.showSnackbar({
          text: 'Error al exportar el itinerario',
          color: 'error'
        })
      } finally {
        exporting.value = false
      }
    }

    const handleOptionSelect = async (option) => {
      showOptionsMenu.value = false

      switch (option) {
        case 'export_pdf':
          await exportItinerary()
          break
        case 'export_calendar':
          // Implementar exportación a calendario
          break
        case 'print':
          window.print()
          break
        case 'reorder':
          // Implementar reordenamiento
          break
      }
    }

    const closeActivityDialog = () => {
      activityDialog.value.show = false
      activityDialog.value.data = {
        title: '',
        location: '',
        category: '',
        startTime: '',
        cost: null,
        description: '',
        date: null
      }
    }

    // Lifecycle hooks
    onMounted(() => {
      fetchItinerary()
    })

    return {
      // Referencias
      activityForm,
      daysContainer,

      // Estado
      loading,
      error,
      exporting,
      trip,
      selectedDate,
      showOptionsMenu,
      activityDialog,
      deleteDialog,

      // Opciones y configuración
      categoryOptions,
      itineraryOptions,
      rules,

      // Computed
      itineraryDays,
      getTotalDays,
      nonTripDates,

      // Métodos
      fetchItinerary,
      addActivity,
      editActivity,
      saveActivity,
      confirmDeleteActivity,
      deleteActivity,
      scrollToDate,
      getDayNumber,
      getDateClass,
      getActivityDots,
      formatDate,
      formatTime,
      formatCurrency,
      getCategoryColor,
      exportItinerary,
      handleOptionSelect,
      closeActivityDialog
    }
  }
}
</script>

<style scoped>
.trip-itinerary {
  min-height: calc(100vh - var(--navbar-height));
}

.date-cell {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.activity-dots {
  display: flex;
  gap: 2px;
  margin-top: 2px;
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
}

.has-activities {
  font-weight: bold;
}

.selected-date {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.activity-card {
  transition: all 0.3s ease;
}

.activity-card:hover {
  transform: translateX(4px);
}

.activity-completed {
  opacity: 0.7;
}

.activity-completed .text-subtitle-1 {
  text-decoration: line-through;
}

.empty-day {
  opacity: 0.7;
}

@media print {

  .v-toolbar,
  .v-btn {
    display: none !important;
  }

  .trip-itinerary {
    padding: 20px;
  }
}

/* Soporte para modo oscuro */
:deep(.v-theme--dark) {
  .selected-date {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .activity-card {
    background-color: rgba(255, 255, 255, 0.05);
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