<template>
  <div class="destination-list">
    <!-- Filtros y búsqueda -->
    <v-card class="mb-6">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field v-model="filters.search" label="Buscar destinos" prepend-inner-icon="mdi-magnify"
              variant="outlined" density="comfortable" hide-details clearable
              @update:model-value="applyFilters"></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-select v-model="filters.category" :items="categoryOptions" label="Categoría" variant="outlined"
              density="comfortable" hide-details clearable @update:model-value="applyFilters"></v-select>
          </v-col>
          <v-col cols="12" sm="3">
            <v-range-slider v-model="filters.priceRange" :min="0" :max="1000" :step="50" label="Rango de precio"
              variant="outlined" density="comfortable" hide-details @update:model-value="applyFilters">
              <template v-slot:prepend>
                <v-text-field v-model="filters.priceRange[0]" hide-details density="compact" type="number"
                  variant="outlined" style="width: 60px"></v-text-field>
              </template>
              <template v-slot:append>
                <v-text-field v-model="filters.priceRange[1]" hide-details density="compact" type="number"
                  variant="outlined" style="width: 60px"></v-text-field>
              </template>
            </v-range-slider>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Grid de destinos -->
    <v-row v-if="!loading">
      <v-col v-for="destination in filteredDestinations" :key="destination.id" cols="12" sm="6" md="4" lg="3">
        <destination-card :destination="destination" @click="viewDestinationDetails(destination)"
          @view-details="viewDestinationDetails(destination)" @create-trip="createTripFromDestination(destination)"
          @toggle-favorite="toggleFavorite(destination)"></destination-card>
      </v-col>

      <!-- Estado vacío -->
      <v-col v-if="filteredDestinations.length === 0" cols="12">
        <v-card class="empty-state pa-6 text-center">
          <v-img src="/api/placeholder/300/200" class="mx-auto mb-4" width="200" height="200"></v-img>
          <h3 class="text-h5 font-weight-bold mb-2">
            No se encontraron destinos
          </h3>
          <p class="text-body-1 text-medium-emphasis mb-4">
            Intenta ajustar los filtros de búsqueda
          </p>
          <v-btn color="primary" @click="clearFilters">
            Limpiar filtros
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Loading state -->
    <div v-else class="d-flex justify-center align-center" style="min-height: 400px">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <!-- Paginación -->
    <div class="d-flex justify-center mt-6">
      <v-pagination v-model="currentPage" :length="totalPages" :total-visible="7"></v-pagination>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDestinationsStore } from '@/stores/destinations'
import { useAppStore } from '@/stores/app'
import DestinationCard from '@/components/common/DestinationCard.vue'

export default {
  name: 'DestinationList',

  components: {
    DestinationCard
  },

  setup() {
    const router = useRouter()
    const destinationsStore = useDestinationsStore()
    const appStore = useAppStore()

    // Estado
    const loading = ref(false)
    const currentPage = ref(1)
    const filters = ref({
      search: '',
      category: null,
      priceRange: [0, 1000]
    })

    // Opciones de filtros
    const categoryOptions = [
      { title: 'Playa', value: 'playa' },
      { title: 'Montaña', value: 'montaña' },
      { title: 'Ciudad', value: 'ciudad' },
      { title: 'Aventura', value: 'aventura' }
    ]

    // Computed
    const filteredDestinations = computed(() => {
      return destinationsStore.filteredDestinations
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredDestinations.value.length / 12)
    })

    // Métodos
    const fetchDestinations = async () => {
      loading.value = true
      try {
        await destinationsStore.fetchDestinations()
      } catch (error) {
        console.error('Error al obtener destinos:', error)
        appStore.showSnackbar({
          text: 'Error al cargar los destinos',
          color: 'error'
        })
      } finally {
        loading.value = false
      }
    }

    const applyFilters = () => {
      destinationsStore.setFilters({
        search: filters.value.search,
        category: filters.value.category,
        priceRange: filters.value.priceRange
      })
      currentPage.value = 1
    }

    const clearFilters = () => {
      filters.value = {
        search: '',
        category: null,
        priceRange: [0, 1000]
      }
      applyFilters()
    }

    const viewDestinationDetails = (destination) => {
      router.push({
        name: 'DestinationDetails',
        params: { id: destination.id }
      })
    }

    const createTripFromDestination = (destination) => {
      router.push({
        name: 'TripCreate',
        query: { destination: destination.id }
      })
    }

    const toggleFavorite = async (destination) => {
      try {
        await destinationsStore.toggleFavorite(destination.id)
        appStore.showSnackbar({
          text: destination.isFavorite ?
            'Eliminado de favoritos' :
            'Agregado a favoritos',
          color: 'success'
        })
      } catch (error) {
        console.error('Error al cambiar favorito:', error)
        appStore.showSnackbar({
          text: 'Error al actualizar favoritos',
          color: 'error'
        })
      }
    }

    // Lifecycle hooks
    onMounted(() => {
      fetchDestinations()
    })

    return {
      loading,
      currentPage,
      filters,
      categoryOptions,
      filteredDestinations,
      totalPages,
      applyFilters,
      clearFilters,
      viewDestinationDetails,
      createTripFromDestination,
      toggleFavorite
    }
  }
}
</script>

<style scoped>
.destination-list {
  min-height: calc(100vh - var(--navbar-height));
  padding: 24px;
}

.empty-state {
  border: 2px dashed rgba(var(--v-theme-primary), 0.2);
  border-radius: 12px;
}

@media (max-width: 600px) {
  .destination-list {
    padding: 16px;
  }
}
</style>