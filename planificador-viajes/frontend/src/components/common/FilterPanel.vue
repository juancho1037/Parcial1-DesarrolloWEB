<template>
  <v-card class="filter-panel">
    <!-- Encabezado del panel -->
    <v-card-title class="d-flex justify-space-between align-center pa-4">
      <span>Filtros</span>
      <v-btn v-if="hasActiveFilters" variant="text" color="error" size="small" @click="clearAllFilters">
        Limpiar filtros
        <v-icon end>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pa-4">
      <!-- Filtro de Categorías -->
      <div class="filter-section">
        <h3 class="text-subtitle-1 font-weight-bold mb-3">Categorías</h3>
        <v-chip-group v-model="selectedCategories" column multiple class="categories-group" selected-class="primary">
          <v-chip v-for="category in categories" :key="category.value" :value="category.value" filter
            variant="outlined">
            <v-icon start>{{ category.icon }}</v-icon>
            {{ category.label }}
          </v-chip>
        </v-chip-group>
      </div>

      <v-divider class="my-4"></v-divider>

      <!-- Filtro de Rango de Precio -->
      <div class="filter-section">
        <h3 class="text-subtitle-1 font-weight-bold mb-3">
          Rango de Precio
          <v-tooltip location="right">
            <template v-slot:activator="{ props }">
              <v-icon size="small" color="primary" v-bind="props" class="ml-1">mdi-information</v-icon>
            </template>
            Precio por persona/noche
          </v-tooltip>
        </h3>

        <div class="price-range">
          <v-range-slider v-model="priceRange" :min="priceMinMax[0]" :max="priceMinMax[1]" :step="50" color="primary"
            thumb-label="always" class="mb-2">
            <template v-slot:thumb-label="{ modelValue }">
              ${{ modelValue }}
            </template>
          </v-range-slider>

          <div class="d-flex align-center justify-space-between">
            <v-text-field v-model.number="priceRange[0]" type="number" variant="outlined" density="compact" hide-details
              class="price-input" prefix="$" @change="validatePriceInput(0)"></v-text-field>
            <span class="mx-2">-</span>
            <v-text-field v-model.number="priceRange[1]" type="number" variant="outlined" density="compact" hide-details
              class="price-input" prefix="$" @change="validatePriceInput(1)"></v-text-field>
          </div>
        </div>
      </div>

      <v-divider class="my-4"></v-divider>

      <!-- Filtro de Calificación -->
      <div class="filter-section">
        <h3 class="text-subtitle-1 font-weight-bold mb-3">
          Calificación mínima
        </h3>
        <div class="d-flex align-center">
          <v-rating v-model="rating" color="amber" half-increments hover class="mr-2"></v-rating>
          <span class="text-body-2 text-medium-emphasis">
            {{ rating ? `${rating} estrellas o más` : 'Cualquier calificación' }}
          </span>
        </div>
      </div>

      <v-divider class="my-4"></v-divider>

      <!-- Filtro de Comodidades -->
      <div class="filter-section">
        <h3 class="text-subtitle-1 font-weight-bold mb-3">Comodidades</h3>
        <v-row dense>
          <v-col v-for="amenity in amenities" :key="amenity.value" cols="12" sm="6">
            <v-checkbox v-model="selectedAmenities" :value="amenity.value" :label="amenity.label" density="comfortable"
              color="primary" hide-details>
              <template v-slot:prepend>
                <v-icon size="small" class="mr-2">
                  {{ amenity.icon }}
                </v-icon>
              </template>
            </v-checkbox>
          </v-col>
        </v-row>
      </div>

      <v-divider class="my-4"></v-divider>

      <!-- Filtros Adicionales -->
      <div class="filter-section">
        <h3 class="text-subtitle-1 font-weight-bold mb-3">Otros Filtros</h3>
        <v-expansion-panels variant="accordion">
          <v-expansion-panel>
            <v-expansion-panel-title>Distancia</v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-slider v-model="distance" :min="0" :max="50" :step="1" thumb-label="always" color="primary">
                <template v-slot:thumb-label>
                  {{ distance }}km
                </template>
              </v-slider>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-title>Duración</v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-select v-model="duration" :items="durationOptions" variant="outlined" density="comfortable"
                hide-details></v-select>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </v-card-text>

    <!-- Botones de acción -->
    <v-card-actions class="pa-4">
      <v-btn color="primary" block @click="applyFilters" :disabled="!hasChanges">
        Aplicar Filtros
        <v-icon end>mdi-check</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'FilterPanel',

  props: {
    initialFilters: {
      type: Object,
      default: () => ({})
    }
  },

  emits: ['update:filters', 'apply-filters'],

  setup(props, { emit }) {
    // Configuración inicial
    const priceMinMax = [0, 1000]

    // Estado de los filtros
    const selectedCategories = ref([])
    const priceRange = ref([priceMinMax[0], priceMinMax[1]])
    const rating = ref(0)
    const selectedAmenities = ref([])
    const distance = ref(10)
    const duration = ref(null)

    // Datos de los filtros
    const categories = [
      { value: 'playa', label: 'Playa', icon: 'mdi-beach' },
      { value: 'montaña', label: 'Montaña', icon: 'mdi-mountain' },
      { value: 'ciudad', label: 'Ciudad', icon: 'mdi-city' },
      { value: 'aventura', label: 'Aventura', icon: 'mdi-hiking' },
      { value: 'cultural', label: 'Cultural', icon: 'mdi-museum' },
      { value: 'relax', label: 'Relax', icon: 'mdi-spa' }
    ]

    const amenities = [
      { value: 'wifi', label: 'WiFi', icon: 'mdi-wifi' },
      { value: 'parking', label: 'Estacionamiento', icon: 'mdi-parking' },
      { value: 'pool', label: 'Piscina', icon: 'mdi-pool' },
      { value: 'restaurant', label: 'Restaurante', icon: 'mdi-silverware' },
      { value: 'gym', label: 'Gimnasio', icon: 'mdi-dumbbell' },
      { value: 'spa', label: 'Spa', icon: 'mdi-spa' }
    ]

    const durationOptions = [
      { title: 'Cualquier duración', value: null },
      { title: 'Hasta 3 días', value: '3' },
      { title: '4-7 días', value: '7' },
      { title: '8-14 días', value: '14' },
      { title: 'Más de 14 días', value: '15+' }
    ]

    // Computed properties
    const hasActiveFilters = computed(() => {
      return selectedCategories.value.length > 0 ||
        priceRange.value[0] > priceMinMax[0] ||
        priceRange.value[1] < priceMinMax[1] ||
        rating.value > 0 ||
        selectedAmenities.value.length > 0 ||
        distance.value !== 10 ||
        duration.value !== null
    })

    const hasChanges = computed(() => {
      return JSON.stringify(getCurrentFilters()) !== JSON.stringify(props.initialFilters)
    })

    // Métodos
    const validatePriceInput = (index) => {
      let value = Number(priceRange.value[index])
      if (isNaN(value)) value = index === 0 ? priceMinMax[0] : priceMinMax[1]
      value = Math.min(Math.max(value, priceMinMax[0]), priceMinMax[1])
      priceRange.value[index] = value
    }

    const getCurrentFilters = () => {
      return {
        categories: selectedCategories.value,
        priceRange: priceRange.value,
        rating: rating.value,
        amenities: selectedAmenities.value,
        distance: distance.value,
        duration: duration.value
      }
    }

    const applyFilters = () => {
      const filters = getCurrentFilters()
      emit('apply-filters', filters)
    }

    const clearAllFilters = () => {
      selectedCategories.value = []
      priceRange.value = [priceMinMax[0], priceMinMax[1]]
      rating.value = 0
      selectedAmenities.value = []
      distance.value = 10
      duration.value = null
      applyFilters()
    }

    // Observadores
    watch(() => props.initialFilters, (newFilters) => {
      if (newFilters) {
        selectedCategories.value = newFilters.categories || []
        priceRange.value = newFilters.priceRange || [priceMinMax[0], priceMinMax[1]]
        rating.value = newFilters.rating || 0
        selectedAmenities.value = newFilters.amenities || []
        distance.value = newFilters.distance || 10
        duration.value = newFilters.duration || null
      }
    }, { immediate: true })

    return {
      // Estado
      selectedCategories,
      priceRange,
      priceMinMax,
      rating,
      selectedAmenities,
      distance,
      duration,

      // Datos
      categories,
      amenities,
      durationOptions,

      // Computed
      hasActiveFilters,
      hasChanges,

      // Métodos
      validatePriceInput,
      applyFilters,
      clearAllFilters
    }
  }
}
</script>

<style scoped>
.filter-panel {
  max-width: 400px;
  border-radius: 12px;
}

.filter-section {
  margin-bottom: 24px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.categories-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.price-input {
  width: 120px;
}

:deep(.v-slider .v-slider-thumb__label) {
  background-color: var(--v-theme-primary);
}

:deep(.v-checkbox .v-selection-control) {
  min-height: 32px;
}

@media (max-width: 600px) {
  .filter-panel {
    max-width: none;
    border-radius: 0;
  }

  .price-input {
    width: 100px;
  }
}

/* Animaciones */
.v-expand-transition {
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-expand-transition-enter-from,
.v-expand-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
</style>