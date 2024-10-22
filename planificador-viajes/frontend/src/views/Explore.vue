<template>
  <div class="explore-container">
    <!-- Hero Search Section -->
    <section class="hero-section">
      <v-container>
        <v-row align="center" justify="center" class="py-12">
          <v-col cols="12" md="8" class="text-center">
            <h1 class="text-h3 font-weight-bold mb-4">Descubre Tu Próximo Destino</h1>
            <p class="text-h6 text-medium-emphasis mb-8">
              Explora destinos increíbles y encuentra tu próxima aventura
            </p>
            <v-card class="search-card mx-auto" max-width="600" elevation="3">
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="8">
                    <v-text-field
                      v-model="searchQuery"
                      label="Buscar destinos, ciudades o actividades"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                      prepend-inner-icon="mdi-magnify"
                      @keyup.enter="searchDestinations"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-btn
                      color="primary"
                      block
                      height="56"
                      @click="searchDestinations"
                    >
                      Buscar
                      <v-icon end>mdi-arrow-right</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Popular Destinations -->
    <section class="popular-destinations py-12 bg-grey-lighten-4">
      <v-container>
        <h2 class="text-h4 font-weight-bold mb-6">Destinos Populares</h2>
        <v-row>
          <v-col
            v-for="destination in popularDestinations"
            :key="destination.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card
              class="destination-card h-100"
              elevation="2"
              @click="showDestinationDetails(destination)"
            >
              <v-img
                :src="destination.image"
                height="200"
                cover
                class="destination-image"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular indeterminate></v-progress-circular>
                  </div>
                </template>
                <v-chip
                  class="ma-4"
                  color="primary"
                  label
                >
                  {{ destination.category }}
                </v-chip>
              </v-img>

              <v-card-title class="text-h6">
                {{ destination.name }}
              </v-card-title>

              <v-card-text>
                <div class="mb-2">
                  <v-icon color="primary" size="small">mdi-map-marker</v-icon>
                  <span class="ml-1">{{ destination.location }}</span>
                </div>
                <p class="text-body-2 text-truncate-2">{{ destination.description }}</p>
                <div class="d-flex align-center mt-2">
                  <v-rating
                    v-model="destination.rating"
                    color="amber"
                    density="compact"
                    size="small"
                    readonly
                  ></v-rating>
                  <span class="text-caption ml-2">({{ destination.reviews }} reseñas)</span>
                </div>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions class="pa-4">
                <div class="text-primary font-weight-bold">
                  Desde ${{ destination.price }}
                </div>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  variant="tonal"
                >
                  Ver Detalles
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Travel Categories -->
    <section class="travel-categories py-12">
      <v-container>
        <h2 class="text-h4 font-weight-bold mb-6">Explora por Categoría</h2>
        <v-row>
          <v-col
            v-for="category in travelCategories"
            :key="category.id"
            cols="12"
            sm="6"
            md="3"
          >
            <v-card
              class="category-card"
              elevation="2"
              @click="filterByCategory(category.id)"
            >
              <v-card-text class="d-flex align-center pa-6">
                <v-icon
                  :color="category.color"
                  size="36"
                  class="mr-4"
                >
                  {{ category.icon }}
                </v-icon>
                <div>
                  <div class="text-h6 font-weight-bold">{{ category.name }}</div>
                  <div class="text-caption text-medium-emphasis">
                    {{ category.count }} destinos
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Featured Experiences -->
    <section class="featured-experiences py-12 bg-grey-lighten-4">
      <v-container>
        <h2 class="text-h4 font-weight-bold mb-6">Experiencias Destacadas</h2>
        <v-row>
          <v-col
            v-for="experience in featuredExperiences"
            :key="experience.id"
            cols="12"
            md="6"
          >
            <v-card class="experience-card" elevation="2">
              <v-row no-gutters>
                <v-col cols="5">
                  <v-img
                    :src="experience.image"
                    class="h-100"
                    cover
                  ></v-img>
                </v-col>
                <v-col cols="7">
                  <v-card-text class="pa-6">
                    <div class="d-flex align-center mb-2">
                      <v-chip
                        size="small"
                        :color="experience.category.color"
                        variant="tonal"
                      >
                        {{ experience.category.name }}
                      </v-chip>
                      <v-rating
                        v-model="experience.rating"
                        color="amber"
                        density="compact"
                        size="small"
                        readonly
                        class="ml-2"
                      ></v-rating>
                    </div>
                    <h3 class="text-h6 font-weight-bold mb-2">{{ experience.title }}</h3>
                    <p class="text-body-2 text-medium-emphasis mb-4">
                      {{ experience.description }}
                    </p>
                    <div class="d-flex align-center justify-space-between">
                      <div class="text-primary font-weight-bold">
                        ${{ experience.price }} por persona
                      </div>
                      <v-btn
                        color="primary"
                        variant="tonal"
                        size="small"
                      >
                        Más Info
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Destination Details Dialog -->
    <v-dialog
      v-model="showDestinationDialog"
      max-width="800"
    >
      <v-card v-if="selectedDestination">
        <v-img
          :src="selectedDestination.image"
          height="300"
          cover
        ></v-img>
        <v-card-title class="text-h5 pa-6">
          {{ selectedDestination.name }}
        </v-card-title>
        <v-card-text class="pa-6 pt-0">
          <p class="text-body-1 mb-4">
            {{ selectedDestination.description }}
          </p>
          <div class="mb-4">
            <v-icon color="primary">mdi-information</v-icon>
            <span class="ml-2 font-weight-medium">Información General</span>
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-weather-sunny</v-icon>
                </template>
                <v-list-item-title>Mejor época para visitar</v-list-item-title>
                <v-list-item-subtitle>
                  {{ selectedDestination.bestSeason }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-clock-outline</v-icon>
                </template>
                <v-list-item-title>Duración recomendada</v-list-item-title>
                <v-list-item-subtitle>
                  {{ selectedDestination.recommendedDuration }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </div>
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="tonal"
            @click="showDestinationDialog = false"
          >
            Cerrar
          </v-btn>
          <v-btn
            color="primary"
            @click="planTrip(selectedDestination)"
          >
            Planificar Viaje
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'Explore',
  data() {
    return {
      searchQuery: '',
      showDestinationDialog: false,
      selectedDestination: null,
      popularDestinations: [
        {
          id: 1,
          name: 'París',
          location: 'Francia',
          description: 'La Ciudad de la Luz, hogar de la Torre Eiffel y el museo del Louvre.',
          image: '/images/paris.jpg',
          category: 'Ciudad',
          rating: 4.8,
          reviews: 1250,
          price: 899,
          bestSeason: 'Primavera (Abril - Junio)',
          recommendedDuration: '5-7 días'
        },
        {
          id: 2,
          name: 'Bali',
          location: 'Indonesia',
          description: 'Isla paradisíaca con playas cristalinas y templos ancestrales.',
          image: '/images/bali.jpg',
          category: 'Playa',
          rating: 4.6,
          reviews: 980,
          price: 799,
          bestSeason: 'Mayo - Septiembre',
          recommendedDuration: '7-10 días'
        },
        {
          id: 3,
          name: 'Machu Picchu',
          location: 'Perú',
          description: 'Antigua ciudad inca en lo alto de los Andes peruanos.',
          image: '/images/machu-picchu.jpg',
          category: 'Aventura',
          rating: 4.9,
          reviews: 850,
          price: 1299,
          bestSeason: 'Mayo - Octubre',
          recommendedDuration: '3-4 días'
        }
      ],
      travelCategories: [
        {
          id: 1,
          name: 'Playa',
          icon: 'mdi-beach',
          color: 'amber',
          count: 45
        },
        {
          id: 2,
          name: 'Montaña',
          icon: 'mdi-mountain',
          color: 'green',
          count: 32
        },
        {
          id: 3,
          name: 'Ciudad',
          icon: 'mdi-city',
          color: 'blue',
          count: 58
        },
        {
          id: 4,
          name: 'Aventura',
          icon: 'mdi-hiking',
          color: 'red',
          count: 27
        }
      ],
      featuredExperiences: [
        {
          id: 1,
          title: 'Tour Gastronómico en Roma',
          description: 'Descubre los sabores auténticos de la cocina italiana en un recorrido por los mejores restaurantes locales.',
          image: '/images/rome-food.jpg',
          category: { name: 'Gastronomía', color: 'orange' },
          rating: 4.7,
          price: 89
        },
        {
          id: 2,
          title: 'Buceo en la Gran Barrera de Coral',
          description: 'Explora el ecosistema marino más grande del mundo con guías expertos.',
          image: '/images/great-barrier.jpg',
          category: { name: 'Aventura', color: 'blue' },
          rating: 4.9,
          price: 199
        }
      ]
    }
  },
  methods: {
    searchDestinations() {
      // Implementar búsqueda
      console.log('Buscando:', this.searchQuery)
    },
    showDestinationDetails(destination) {
      this.selectedDestination = destination
      this.showDestinationDialog = true
    },
    filterByCategory(categoryId) {
      // Implementar filtrado por categoría
      console.log('Filtrando por categoría:', categoryId)
    },
    planTrip(destination) {
      // Implementar planificación de viaje
      this.$router.push('/trips/new')
    }
  }
}
</script>

<style scoped>
.explore-container {
  background: #f8fafc;
}

/* Hero Section Styles */
.hero-section {
  background: linear-gradient(135deg, var(--v-theme-primary) 0%, #1976d2 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.1) 1px, transparent 0);
  background-size: 20px 20px;
  opacity: 0.5;
}

/* Card Styles */
.search-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.search-card:hover {
  transform: translateY(-5px);
}

/* Destination Cards */
.destination-card {
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.destination-image {
  transition: transform 0.3s ease;
}

.destination-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
}

.destination-card:hover .destination-image {
  transform: scale(1.05);
}

/* Category Cards */
.category-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.05) 0%,
    rgba(var(--v-theme-primary), 0.1) 100%
  );
}

/* Experience Cards */
.experience-card {
  transition: all 0.3s ease;
}

.experience-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
}

/* Utility Classes */
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.destination-card,
.category-card,
.experience-card {
  animation: fadeInUp 0.6s ease-out forwards;
}

/* Animation Delays */
.destination-card:nth-child(2) { animation-delay: 0.2s; }
.destination-card:nth-child(3) { animation-delay: 0.4s; }
.category-card:nth-child(2) { animation-delay: 0.1s; }
.category-card:nth-child(3) { animation-delay: 0.2s; }
.category-card:nth-child(4) { animation-delay: 0.3s; }

/* Responsive Styles */
@media (max-width: 960px) {
  .hero-section {
    padding: 40px 0;
  }
  
  .text-h3 {
    font-size: 2rem !important;
  }
  
  .text-h4 {
    font-size: 1.75rem !important;
  }
  
  .search-card {
    margin: 0 16px;
  }
}

/* Dialog Styles */
.v-dialog .v-card {
  border-radius: 16px;
  overflow: hidden;
}

/* Performance Optimizations */
.destination-image {
  transform: translateZ(0);
  will-change: transform;
}
</style>