<template>
  <div class="trip-list">
    <!-- Header con acciones -->
    <v-row class="mb-6" align="center">
      <v-col cols="12" sm="6">
        <h1 class="text-h4 font-weight-bold">
          Mis Viajes
        </h1>
      </v-col>
      <v-col cols="12" sm="6" class="d-flex justify-end">
        <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: 'TripCreate' }">
          Nuevo Viaje
        </v-btn>
      </v-col>
    </v-row>

    <!-- Filtros y búsqueda -->
    <v-card class="mb-6">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field v-model="filters.search" label="Buscar viaje" prepend-inner-icon="mdi-magnify"
              variant="outlined" density="comfortable" hide-details clearable
              @update:model-value="applyFilters"></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-select v-model="filters.status" :items="statusOptions" label="Estado" variant="outlined"
              density="comfortable" hide-details clearable @update:model-value="applyFilters"></v-select>
          </v-col>
          <v-col cols="12" sm="3">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-text-field v-model="filters.formattedDate" label="Fecha" variant="outlined" density="comfortable"
                  hide-details readonly clearable prepend-inner-icon="mdi-calendar" v-bind="props"
                  @click:clear="clearDateFilter"></v-text-field>
              </template>
              <v-date-picker v-model="filters.date" @update:model-value="handleDateSelect"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="2" class="d-flex align-center">
            <v-btn variant="text" color="error" :disabled="!hasActiveFilters" @click="clearFilters">
              Limpiar filtros
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Lista de viajes -->
    <v-row v-if="!loading">
      <v-col v-for="trip in filteredTrips" :key="trip.id" cols="12" md="6" lg="4">
        <trip-card :trip="trip" :editable="true" @click="viewTripDetails(trip)" @edit="editTrip(trip)"
          @delete="confirmDelete(trip)" @toggle-favorite="toggleFavorite(trip)"></trip-card>
      </v-col>

      <!-- Estado vacío -->
      <v-col v-if="filteredTrips.length === 0" cols="12">
        <v-card class="empty-state pa-6 text-center">
          <v-img src="/api/placeholder/300/200" class="mx-auto mb-4" width="200" height="200"></v-img>
          <h3 class="text-h5 font-weight-bold mb-2">
            {{ getEmptyStateMessage }}
          </h3>
          <p class="text-body-1 text-medium-emphasis mb-4">
            {{ getEmptyStateDescription }}
          </p>
          <v-btn color="primary" :to="{ name: 'TripCreate' }" prepend-icon="mdi-plus">
            Crear mi primer viaje
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Loading state -->
    <div v-else class="d-flex justify-center align-center" style="min-height: 400px">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <!-- Diálogo de confirmación de eliminación -->
    <v-dialog v-model="deleteDialog.show" max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          ¿Eliminar viaje?
        </v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar el viaje "{{ deleteDialog.trip?.title }}"? Esta acción no se puede
          deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="deleteDialog.show = false">
            Cancelar
          </v-btn>
          <v-btn color="error" variant="flat" :loading="deleteDialog.loading" @click="deleteTrip">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTripsStore } from '@/store/modules/trips'
import { useAppStore } from '@/store/modules/app'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import TripCard from '@/components/common/TripCard.vue'

export default {
  name: 'TripList',

  components: {
    TripCard
  },

  setup() {
    const router = useRouter()
    const tripsStore = useTripsStore()
    const appStore = useAppStore()

    // Estado
    const loading = ref(false)
    const filters = ref({
      search: '',
      status: null,
      date: null,
      formattedDate: ''
    })
    const deleteDialog = ref({
      show: false,
      trip: null,
      loading: false
    })

    // Opciones de filtros
    const statusOptions = [
      { title: 'Planificado', value: 'planificado' },
      { title: 'En Progreso', value: 'en-progreso' },
      { title: 'Completado', value: 'completado' },
      { title: 'Cancelado', value: 'cancelado' }
    ]

    // Computed
    const filteredTrips = computed(() => tripsStore.filteredTrips)

    const hasActiveFilters = computed(() => {
      return filters.value.search ||
        filters.value.status ||
        filters.value.date
    })

    const getEmptyStateMessage = computed(() => {
      if (hasActiveFilters.value) {
        return 'No se encontraron viajes'
      }
      return 'Aún no tienes viajes'
    })

    const getEmptyStateDescription = computed(() => {
      if (hasActiveFilters.value) {
        return 'Prueba ajustando los filtros de búsqueda'
      }
      return '¡Comienza a planificar tu próxima aventura!'
    })

    // Métodos
    const fetchTrips = async () => {
      loading.value = true
      try {
        await tripsStore.fetchTrips()
      } catch (error) {
        console.error('Error al obtener viajes:', error)
      } finally {
        loading.value = false
      }
    }

    const applyFilters = () => {
      tripsStore.setFilters({
        search: filters.value.search,
        status: filters.value.status,
        date: filters.value.date
      })
    }

    const clearFilters = () => {
      filters.value = {
        search: '',
        status: null,
        date: null,
        formattedDate: ''
      }
      tripsStore.clearFilters()
    }

    const handleDateSelect = (date) => {
      filters.value.date = date
      filters.value.formattedDate = format(new Date(date), 'dd MMM yyyy', { locale: es })
      applyFilters()
    }

    const clearDateFilter = () => {
      filters.value.date = null
      filters.value.formattedDate = ''
      applyFilters()
    }

    const viewTripDetails = (trip) => {
      router.push({ name: 'TripDetails', params: { id: trip.id } })
    }

    const editTrip = (trip) => {
      router.push({ name: 'TripEdit', params: { id: trip.id } })
    }

    const confirmDelete = (trip) => {
      deleteDialog.value = {
        show: true,
        trip,
        loading: false
      }
    }

    const deleteTrip = async () => {
      if (!deleteDialog.value.trip) return

      deleteDialog.value.loading = true
      try {
        await tripsStore.deleteTrip(deleteDialog.value.trip.id)
        appStore.showSnackbar({
          text: 'Viaje eliminado correctamente',
          color: 'success'
        })
        deleteDialog.value.show = false
      } catch (error) {
        console.error('Error al eliminar viaje:', error)
        appStore.showSnackbar({
          text: 'Error al eliminar el viaje',
          color: 'error'
        })
      } finally {
        deleteDialog.value.loading = false
      }
    }

    const toggleFavorite = async (trip) => {
      try {
        await tripsStore.toggleFavorite(trip.id)
      } catch (error) {
        console.error('Error al cambiar favorito:', error)
      }
    }

    // Lifecycle
    onMounted(fetchTrips)

    return {
      loading,
      filters,
      deleteDialog,
      statusOptions,
      filteredTrips,
      hasActiveFilters,
      getEmptyStateMessage,
      getEmptyStateDescription,
      applyFilters,
      clearFilters,
      handleDateSelect,
      clearDateFilter,
      viewTripDetails,
      editTrip,
      confirmDelete,
      deleteTrip,
      toggleFavorite
    }
  }
}
</script>

<style scoped>
.trip-list {
  min-height: calc(100vh - var(--navbar-height));
  padding: 24px;
}

.empty-state {
  border: 2px dashed rgba(var(--v-theme-primary), 0.2);
  border-radius: 12px;
}

@media (max-width: 600px) {
  .trip-list {
    padding: 16px;
  }
}
</style>