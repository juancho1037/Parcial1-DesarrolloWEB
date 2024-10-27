<template>
  <v-card class="destination-card" :elevation="hover ? 4 : 1" @click="$emit('click')">
    <v-img :src="`/api/placeholder/400/250`" :aspect-ratio="16 / 10" cover class="destination-image">
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-row>
      </template>
      <v-overlay contained class="align-end" :model-value="true" scrim="rgba(0, 0, 0, 0.3)">
        <v-chip :color="getCategoryColor(destination.category)" size="small" class="ma-2">
          {{ destination.category }}
        </v-chip>
      </v-overlay>
    </v-img>

    <v-card-title class="d-flex justify-space-between align-center pt-4">
      {{ destination.name }}
      <v-btn icon variant="text" @click.stop="toggleFavorite" :color="destination.isFavorite ? 'red' : undefined">
        <v-icon>
          {{ destination.isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}
        </v-icon>
      </v-btn>
    </v-card-title>

    <v-card-subtitle>
      <div class="d-flex align-center">
        <v-rating :model-value="destination.rating" color="amber" density="compact" half-increments readonly
          size="small"></v-rating>
        <span class="ml-2 text-body-2">
          ({{ destination.reviewsCount }} reseñas)
        </span>
      </div>
    </v-card-subtitle>

    <v-card-text>
      <p class="text-truncate mb-2">{{ destination.description }}</p>
      <div class="d-flex align-center mt-2">
        <v-icon size="small" color="success" class="mr-1">
          mdi-currency-usd
        </v-icon>
        <span class="text-success">Desde {{ destination.priceRange }}</span>
      </div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn variant="text" color="primary" @click.stop="$emit('view-details')">
        Ver Detalles
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn variant="text" color="primary" @click.stop="$emit('create-trip')">
        Planear Viaje
        <v-icon end>mdi-airplane</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'DestinationCard',

  props: {
    destination: {
      type: Object,
      required: true
    }
  },

  emits: ['click', 'view-details', 'create-trip', 'toggle-favorite'],

  setup(props, { emit }) {
    const hover = ref(false)

    const getCategoryColor = (category) => {
      const colors = {
        'playa': 'blue',
        'montaña': 'green',
        'ciudad': 'purple',
        'aventura': 'orange'
      }
      return colors[category] || 'grey'
    }

    const toggleFavorite = () => {
      emit('toggle-favorite', props.destination.id)
    }

    return {
      hover,
      getCategoryColor,
      toggleFavorite
    }
  }
}
</script>

<style scoped>
.destination-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.destination-card:hover {
  transform: translateY(-4px);
}

.destination-image {
  transition: transform 0.3s ease;
}

.destination-card:hover .destination-image {
  transform: scale(1.05);
}
</style>