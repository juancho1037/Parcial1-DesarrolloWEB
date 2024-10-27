SearchBar Template Complete Fix

<template>
  <div class="search-container">
    <v-card class="search-card" :elevation="focused ? 4 : 1">
      <v-form @submit.prevent="handleSearch">
        <v-row class="pa-3" align="center" no-gutters>

          <!-- Campo de búsqueda principal -->
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="searchQuery" :placeholder="placeholder" variant="outlined" density="comfortable"
              hide-details clearable @focus="focused = true" @blur="focused = false" @click:clear="clearSearch"
              prepend-inner-icon="mdi-magnify">
              <template v-slot:append>
                <v-fade-transition>
                  <v-progress-circular v-if="loading" indeterminate color="primary" size="20"></v-progress-circular>
                </v-fade-transition>
              </template>
            </v-text-field>
          </v-col>

          <!-- Selector de categoría -->
          <v-col cols="12" sm="6" md="3" class="px-sm-3">
            <v-select v-model="selectedCategory" :items="categories" variant="outlined" density="comfortable"
              hide-details placeholder="Categoría" clearable prepend-inner-icon="mdi-tag-multiple"></v-select>
          </v-col>

          <!-- Selector de fechas -->
          <v-col cols="12" sm="6" md="3">
            <v-menu v-model="dateMenu" :close-on-content-click="false" transition="scale-transition" min-width="auto">
              <template v-slot:activator="{ props }">
                <v-text-field v-model="formattedDateRange" variant="outlined" density="comfortable" hide-details
                  placeholder="Fechas" readonly clearable prepend-inner-icon="mdi-calendar" v-bind="props"
                  @click:clear="clearDates"></v-text-field>
              </template>
              <v-date-picker v-model="dateRange" range color="primary"
                @update:model-value="dateMenu = false"></v-date-picker>
            </v-menu>
          </v-col>

          <!-- Botón de búsqueda -->
          <v-col cols="12" sm="6" md="2">
            <v-btn color="primary" block height="48" :loading="loading" @click="handleSearch">
              Buscar
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <!-- Filtros avanzados -->
        <v-expand-transition>
          <div v-if="showAdvanced" class="px-3 pb-3">
            <v-divider class="my-3"></v-divider>
            <v-row>
              <!-- Rango de precio -->
              <v-col cols="12" md="6">
                <v-range-slider v-model="priceRange" :min="0" :max="1000" :step="50" color="primary"
                  thumb-label="always" class="mt-4">
                  <template v-slot:prepend>
                    <v-text-field v-model="priceRange[0]" type="number" variant="outlined" density="compact"
                      hide-details class="mt-0 pt-0" style="width: 90px" prefix="$"></v-text-field>
                  </template>
                  <template v-slot:append>
                    <v-text-field v-model="priceRange[1]" type="number" variant="outlined" density="compact"
                      hide-details class="mt-0 pt-0" style="width: 90px" prefix="$"></v-text-field>
                  </template>
                </v-range-slider>
              </v-col>

              <!-- Rating mínimo -->
              <v-col cols="12" md="6" class="d-flex align-center">
                <span class="text-body-2 mr-4">Rating mínimo:</span>
                <v-rating v-model="minRating" color="amber" half-increments hover size="small"></v-rating>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
      </v-form>
    </v-card>

    <!-- Toggle para filtros avanzados -->
    <div class="text-center mt-2">
      <v-btn variant="text" size="small" @click="showAdvanced = !showAdvanced">
        {{ showAdvanced ? 'Menos filtros' : 'Más filtros' }}
        <v-icon end>
          {{ showAdvanced ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
        </v-icon>
      </v-btn>
    </div>

    <!-- Chips de filtros activos -->
    <v-slide-y-transition>
      <div v-if="hasActiveFilters" class="active-filters mt-4">
        <v-chip v-if="searchQuery" class="mr-2 mb-2" closable @click:close="clearSearch">
          {{ searchQuery }}
        </v-chip>
        <v-chip v-if="selectedCategory" class="mr-2 mb-2" closable @click:close="selectedCategory = null">
          {{ selectedCategory }}
        </v-chip>
        <v-chip v-if="dateRange.length" class="mr-2 mb-2" closable @click:close="clearDates">
          {{ formattedDateRange }}
        </v-chip>
        <v-chip v-if="minRating" class="mr-2 mb-2" closable @click:close="minRating = 0">
          {{ minRating }} estrellas o más
        </v-chip>
        <v-chip v-if="isPriceRangeModified" class="mr-2 mb-2" closable @click:close="resetPriceRange">
          ${{ priceRange[0] }} - ${{ priceRange[1] }}
        </v-chip>
        <v-btn variant="text" size="small" color="error" @click="clearAllFilters">
          Limpiar todos
          <v-icon end>mdi-close</v-icon>
        </v-btn>
      </div>
    </v-slide-y-transition>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default {
  name: 'SearchBar',

  props: {
    placeholder: {
      type: String,
      default: 'Buscar...'
    },
    showDestinations: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  emits: ['search', 'clear'],

  setup(props, { emit }) {
    // Estado del componente
    const focused = ref(false)
    const searchQuery = ref('')
    const selectedDestination = ref(null)
    const dateMenu = ref(false)
    const dateRange = ref([])
    const showAdvanced = ref(false)
    const selectedCategories = ref([])
    const priceRange = ref([0, 1000])
    const minRating = ref(0)

    // Datos simulados
    const destinations = [
      { id: 1, name: 'París, Francia' },
      { id: 2, name: 'Roma, Italia' },
      { id: 3, name: 'Barcelona, España' }
    ]

    const categories = [
      'Playa',
      'Montaña',
      'Ciudad',
      'Aventura',
      'Cultural',
      'Gastronómico'
    ]

    // Computed properties
    const formattedDateRange = computed(() => {
      if (!dateRange.value || dateRange.value.length !== 2) return ''
      const [start, end] = dateRange.value
      return `${format(new Date(start), 'dd MMM', { locale: es })} - ${format(new Date(end), 'dd MMM yyyy', { locale: es })}`
    })

    const getDestinationName = computed(() => {
      if (!selectedDestination.value) return ''
      return destinations.find(d => d.id === selectedDestination.value)?.name
    })

    const hasActiveFilters = computed(() => {
      return searchQuery.value ||
        selectedDestination.value ||
        dateRange.value.length ||
        selectedCategories.value.length ||
        minRating.value > 0 ||
        priceRange.value[0] > 0 ||
        priceRange.value[1] < 1000
    })

    // Métodos
    const handleSearch = () => {
      emit('search', {
        query: searchQuery.value,
        destination: selectedDestination.value,
        dates: dateRange.value,
        categories: selectedCategories.value,
        priceRange: priceRange.value,
        rating: minRating.value
      })
    }

    const clearSearch = () => {
      searchQuery.value = ''
      emit('clear')
    }

    const clearDates = () => {
      dateRange.value = []
    }

    const removeCategory = (category) => {
      selectedCategories.value = selectedCategories.value.filter(c => c !== category)
    }

    const clearAllFilters = () => {
      searchQuery.value = ''
      selectedDestination.value = null
      dateRange.value = []
      selectedCategories.value = []
      priceRange.value = [0, 1000]
      minRating.value = 0
      emit('clear')
    }

    return {
      focused,
      searchQuery,
      selectedDestination,
      dateMenu,
      dateRange,
      showAdvanced,
      selectedCategories,
      priceRange,
      minRating,
      destinations,
      categories,
      formattedDateRange,
      getDestinationName,
      hasActiveFilters,
      handleSearch,
      clearSearch,
      clearDates,
      removeCategory,
      clearAllFilters
    }
  }
}
</script>

<style scoped>
.search-container {
  max-width: 1200px;
  margin: 0 auto;
}

.search-card {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

:deep(.v-text-field .v-field__input) {
  min-height: 48px !important;
  padding-top: 0;
  padding-bottom: 0;
}

:deep(.v-text-field) {
  border-radius: 8px;
}

@media (max-width: 960px) {
  .search-card {
    border-radius: 8px;
  }

  :deep(.v-col + .v-col) {
    margin-top: 12px;
  }
}
</style>