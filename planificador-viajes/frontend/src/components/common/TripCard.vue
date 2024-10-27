<template>
  <v-card :class="['trip-card', { 'expanded': expanded }]" :elevation="hover ? 4 : 1" @click="$emit('click')">
    <v-img :src="`/api/placeholder/400/200`" :aspect-ratio="16 / 9" cover class="trip-image">
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-row>
      </template>
      <v-overlay contained class="align-end" :model-value="true" scrim="rgba(0, 0, 0, 0.3)">
        <v-chip :color="getStatusColor(trip.status)" size="small" class="ma-2">
          {{ trip.status }}
        </v-chip>
      </v-overlay>
    </v-img>

    <v-card-title class="d-flex justify-space-between align-center">
      {{ trip.title }}
      <v-btn icon variant="text" @click.stop="toggleFavorite" :color="trip.isFavorite ? 'red' : undefined">
        <v-icon>
          {{ trip.isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}
        </v-icon>
      </v-btn>
    </v-card-title>

    <v-card-subtitle>
      <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>
      {{ trip.destination }}
    </v-card-subtitle>

    <v-card-text>
      <div class="d-flex align-center mb-2">
        <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
        {{ formatDateRange(trip.startDate, trip.endDate) }}
      </div>
      <div class="d-flex align-center">
        <v-icon size="small" class="mr-1">mdi-account-group</v-icon>
        {{ trip.travelers }} viajeros
      </div>
    </v-card-text>

    <v-expand-transition>
      <div v-if="expanded">
        <v-divider></v-divider>
        <v-card-text>
          <p class="text-body-2">{{ trip.description }}</p>
          <v-chip-group class="mt-2">
            <v-chip v-for="activity in trip.activities" :key="activity.id" size="small" color="primary"
              variant="outlined">
              {{ activity.name }}
            </v-chip>
          </v-chip-group>
        </v-card-text>
      </div>
    </v-expand-transition>

    <v-card-actions>
      <v-btn variant="text" color="primary" @click.stop="expanded = !expanded">
        {{ expanded ? 'Menos' : 'Más' }}
        <v-icon>{{ expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn variant="text" color="primary" @click.stop="$emit('edit')" :disabled="!editable">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn variant="text" color="error" @click.stop="$emit('delete')" :disabled="!editable">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref } from 'vue'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default {
  name: 'TripCard',

  props: {
    trip: {
      type: Object,
      required: true
    },
    editable: {
      type: Boolean,
      default: false
    }
  },

  emits: ['click', 'edit', 'delete', 'toggle-favorite'],

  setup(props, { emit }) {
    const expanded = ref(false)
    const hover = ref(false)

    const getStatusColor = (status) => {
      const colors = {
        'planificado': 'info',
        'en-progreso': 'warning',
        'completado': 'success',
        'cancelado': 'error'
      }
      return colors[status] || 'grey'
    }

    const formatDateRange = (start, end) => {
      const startDate = format(new Date(start), 'dd MMM', { locale: es })
      const endDate = format(new Date(end), 'dd MMM yyyy', { locale: es })
      return `${startDate} - ${endDate}`
    }

    const toggleFavorite = () => {
      emit('toggle-favorite', props.trip.id)
    }

    return {
      expanded,
      hover,
      getStatusColor,
      formatDateRange,
      toggleFavorite
    }
  }
}
</script>

<style scoped>
.trip-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.trip-card:hover {
  transform: translateY(-4px);
}

.trip-image {
  transition: all 0.3s ease;
}

.expanded .trip-image {
  transform: scale(1.02);
}
</style>