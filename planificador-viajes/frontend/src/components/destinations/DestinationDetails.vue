<template>
  <div class="destination-details">
    <!-- Loading state -->
    <div v-if="loading" class="d-flex justify-center align-center" style="min-height: 80vh">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <!-- Error state -->
    <v-card v-else-if="error" class="error-state mx-auto pa-6 text-center">
      <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
      <h3 class="text-h5 font-weight-bold mb-2">
        Error al cargar el destino
      </h3>
      <p class="text-body-1 text-medium-emphasis mb-4">
        No se pudo cargar la información del destino. Por favor, intenta nuevamente.
      </p>
      <v-btn color="primary" @click="fetchDestinationDetails">
        Reintentar
      </v-btn>
    </v-card>

    <!-- Contenido del destino -->
    <template v-else>
      <!-- Hero section -->
      <div class="destination-hero position-relative">
        <v-img :src="`/api/placeholder/1920/600`" height="600" class="hero-image"
          gradient="to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)">
          <div class="hero-content d-flex flex-column justify-end fill-height pa-6">
            <div class="d-flex align-center mb-4">
              <h1 class="text-h2 font-weight-bold text-white">
                {{ destination.name }}
              </h1>
              <v-spacer></v-spacer>
              <v-btn icon="mdi-heart" variant="text" color="white" size="large"
                :class="{ 'favorite-active': destination.isFavorite }" @click="toggleFavorite"></v-btn>
            </div>

            <div class="d-flex align-center flex-wrap gap-4">
              <v-chip :color="getCategoryColor(destination.category)" class="text-uppercase">
                {{ destination.category }}
              </v-chip>
              <div class="d-flex align-center">
                <v-rating :model-value="destination.rating" color="amber" half-increments readonly
                  size="small"></v-rating>
                <span class="text-white ml-2">
                  ({{ destination.reviews }} reseñas)
                </span>
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="hero-actions pa-4 position-absolute top-0 end-0">
            <v-btn color="primary" class="mr-2" prepend-icon="mdi-share-variant" @click="shareDestination">
              Compartir
            </v-btn>
            <v-btn color="primary" prepend-icon="mdi-airplane" @click="planTrip">
              Planear Viaje
            </v-btn>
          </div>
        </v-img>
      </div>

      <!-- Contenido principal -->
      <v-container class="py-8">
        <v-row>
          <!-- Columna principal -->
          <v-col cols="12" md="8">
            <!-- Descripción -->
            <v-card class="mb-6">
              <v-card-title class="text-h6 font-weight-bold">
                Sobre el destino
              </v-card-title>
              <v-card-text>
                <p class="text-body-1">{{ destination.description }}</p>
              </v-card-text>
            </v-card>

            <!-- Puntos destacados -->
            <v-card class="mb-6">
              <v-card-title class="text-h6 font-weight-bold">
                Puntos destacados
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col v-for="highlight in destination.highlights" :key="highlight.title" cols="12" sm="6">
                    <v-card variant="outlined" class="highlight-card">
                      <v-card-text>
                        <div class="d-flex align-center">
                          <v-icon :color="highlight.color" size="32" class="mr-3">
                            {{ highlight.icon }}
                          </v-icon>
                          <div>
                            <div class="text-subtitle-1 font-weight-medium">
                              {{ highlight.title }}
                            </div>
                            <div class="text-body-2 text-medium-emphasis">
                              {{ highlight.description }}
                            </div>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Actividades -->
            <v-card class="mb-6">
              <v-card-title class="text-h6 font-weight-bold">
                Actividades populares
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col v-for="activity in destination.activities" :key="activity.id" cols="12" sm="6">
                    <activity-card :activity="activity" @click="viewActivityDetails(activity)"></activity-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Barra lateral -->
          <v-col cols="12" md="4">
            <!-- Mapa -->
            <v-card class="mb-6">
              <v-card-title class="text-h6 font-weight-bold">
                Ubicación
              </v-card-title>
              <v-img :src="`/api/placeholder/400/300`" height="300" class="map-preview"></v-img>
              <v-card-text>
                <div class="d-flex align-center mb-2">
                  <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
                  <span class="text-body-1">{{ destination.location }}</span>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn block variant="text" prepend-icon="mdi-map" @click="openMap">
                  Ver en mapa completo
                </v-btn>
              </v-card-actions>
            </v-card>

            <!-- Información del clima -->
            <v-card class="mb-6">
              <v-card-title class="text-h6 font-weight-bold">
                Clima
              </v-card-title>
              <v-card-text>
                <div class="d-flex align-center mb-4">
                  <v-icon size="48" color="primary" class="mr-4">
                    {{ getWeatherIcon(destination.weather.condition) }}
                  </v-icon>
                  <div>
                    <div class="text-h4 font-weight-bold">
                      {{ destination.weather.temperature }}°C
                    </div>
                    <div class="text-body-2 text-medium-emphasis">
                      {{ destination.weather.description }}
                    </div>
                  </div>
                </div>
                <v-divider class="mb-4"></v-divider>
                <div class="text-body-2">
                  <div class="mb-2">
                    <strong>Mejor época para visitar:</strong>
                    {{ destination.bestSeason }}
                  </div>
                  <div>
                    <strong>Temperatura promedio:</strong>
                    {{ destination.weather.averageTemp }}°C
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <!-- Precios y disponibilidad -->
            <v-card class="mb-6">
              <v-card-title class="text-h6 font-weight-bold">
                Precios
              </v-card-title>
              <v-card-text>
                <div class="price-range mb-4">
                  <div class="text-h4 font-weight-bold text-primary mb-2">
                    Desde ${{ destination.priceRange.min }}
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    por persona/noche
                  </div>
                </div>
                <v-list density="comfortable">
                  <v-list-item v-for="(price, index) in destination.prices" :key="index" :title="price.type"
                    :subtitle="`$${price.amount}`">
                    <template v-slot:prepend>
                      <v-icon :color="price.color">{{ price.icon }}</v-icon>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" block prepend-icon="mdi-calendar" @click="checkAvailability">
                  Verificar disponibilidad
                </v-btn>
              </v-card-actions>
            </v-card>

            <!-- Reseñas destacadas -->
            <v-card>
              <v-card-title class="text-h6 font-weight-bold d-flex align-center">
                Reseñas
                <v-spacer></v-spacer>
                <v-btn variant="text" density="comfortable" @click="viewAllReviews">
                  Ver todas
                </v-btn>
              </v-card-title>
              <v-card-text>
                <div v-for="review in featuredReviews" :key="review.id" class="review-item mb-4">
                  <div class="d-flex align-center mb-2">
                    <v-avatar size="40" color="primary" class="mr-3">
                      <span class="text-subtitle-2 text-white">
                        {{ getInitials(review.author) }}
                      </span>
                    </v-avatar>
                    <div>
                      <div class="text-subtitle-1 font-weight-medium">
                        {{ review.author }}
                      </div>
                      <v-rating :model-value="review.rating" color="amber" density="compact" half-increments readonly
                        size="small"></v-rating>
                    </div>
                    <v-spacer></v-spacer>
                    <span class="text-caption text-medium-emphasis">
                      {{ formatDate(review.date) }}
                    </span>
                  </div>
                  <p class="text-body-2">{{ review.comment }}</p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Diálogo para compartir -->
      <v-dialog v-model="shareDialog.show" max-width="500">
        <v-card>
          <v-card-title class="text-h5">
            Compartir destino
          </v-card-title>
          <v-card-text>
            <v-tabs v-model="shareDialog.tab" class="mb-4">
              <v-tab value="link">Enlace</v-tab>
              <v-tab value="email">Email</v-tab>
            </v-tabs>

            <v-window v-model="shareDialog.tab">
              <v-window-item value="link">
                <v-text-field v-model="shareDialog.link" readonly variant="outlined"
                  append-inner-icon="mdi-content-copy" @click:append-inner="copyLink"></v-text-field>
                <v-list density="compact" class="mb-2">
                  <v-list-subheader>Compartir en redes sociales</v-list-subheader>
                  <v-list-item v-for="network in socialNetworks" :key="network.name" :title="network.name"
                    :prepend-icon="network.icon" :color="network.color" @click="shareToSocial(network.type)"
                    class="social-share-item"></v-list-item>
                </v-list>
              </v-window-item>

              <v-window-item value="email">
                <v-text-field v-model="shareDialog.email" label="Email del destinatario" variant="outlined" type="email"
                  :rules="rules.email" class="mb-4"></v-text-field>
                <v-textarea v-model="shareDialog.message" label="Mensaje personalizado" variant="outlined"
                  rows="3"></v-textarea>
              </v-window-item>
            </v-window>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey-darken-1" variant="text" @click="shareDialog.show = false">
              Cancelar
            </v-btn>
            <v-btn v-if="shareDialog.tab === 'email'" color="primary" :loading="shareDialog.loading"
              @click="sendShareEmail">
              Enviar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </div>
</template>

<!-- Script section -->
<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDestinationsStore } from '@/stores/destinations'
import { useAppStore } from '@/stores/app'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import ActivityCard from '@/components/common/ActivityCard.vue'
import DestinationMap from '@/components/destinations/DestinationMap.vue'

export default {
  name: 'DestinationDetails',

  components: {
    ActivityCard,
    DestinationMap
  },

  setup() {
    const router = useRouter()
    const destinationsStore = useDestinationsStore()
    const appStore = useAppStore()

    // Estado
    const loading = ref(false)
    const error = ref(false)
    const destination = ref(null)
    const shareDialog = ref({
      show: false,
      tab: 'link',
      link: '',
      email: '',
      message: '',
      loading: false
    })

    // Redes sociales
    const socialNetworks = [
      { name: 'WhatsApp', icon: 'mdi-whatsapp', color: 'success', type: 'whatsapp' },
      { name: 'Facebook', icon: 'mdi-facebook', color: 'blue', type: 'facebook' },
      { name: 'Twitter', icon: 'mdi-twitter', color: 'info', type: 'twitter' },
      { name: 'Telegram', icon: 'mdi-telegram', color: 'primary', type: 'telegram' }
    ]

    // Reseñas destacadas
    const featuredReviews = computed(() => {
      return destination.value?.reviews?.slice(0, 3) || []
    })

    // Reglas de validación
    const rules = {
      email: [
        v => !v || /.+@.+\..+/.test(v) || 'Email debe ser válido'
      ]
    }

    // Métodos
    const fetchDestinationDetails = async () => {
      loading.value = true
      error.value = false

      try {
        const destinationId = route.params.id
        const data = await destinationsStore.getDestinationById(destinationId)

        if (!data) throw new Error('Destino no encontrado')

        destination.value = data
        shareDialog.value.link = `${window.location.origin}/destinations/${destinationId}`
      } catch (err) {
        console.error('Error al cargar destino:', err)
        error.value = true
        appStore.showSnackbar({
          text: 'Error al cargar los detalles del destino',
          color: 'error'
        })
      } finally {
        loading.value = false
      }
    }

    const planTrip = () => {
      router.push({
        name: 'TripCreate',
        query: { destination: destination.value.id }
      })
    }

    const shareDestination = () => {
      shareDialog.value.show = true
    }

    const copyLink = () => {
      navigator.clipboard.writeText(shareDialog.value.link)
      appStore.showSnackbar({
        text: 'Enlace copiado al portapapeles',
        color: 'success'
      })
    }

    const sendShareEmail = async () => {
      if (!shareDialog.value.email) return

      shareDialog.value.loading = true
      try {
        await destinationsStore.shareDestination({
          destinationId: destination.value.id,
          email: shareDialog.value.email,
          message: shareDialog.value.message
        })

        appStore.showSnackbar({
          text: 'Destino compartido exitosamente',
          color: 'success'
        })
        shareDialog.value.show = false
      } catch (error) {
        console.error('Error al compartir:', error)
        appStore.showSnackbar({
          text: 'Error al compartir el destino',
          color: 'error'
        })
      } finally {
        shareDialog.value.loading = false
      }
    }

    // Métodos de utilidad
    const getInitials = (name) => {
      return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }

    const formatDate = (date) => {
      return format(new Date(date), 'dd MMM yyyy', { locale: es })
    }

    const getWeatherIcon = (condition) => {
      const icons = {
        'sunny': 'mdi-weather-sunny',
        'cloudy': 'mdi-weather-cloudy',
        'rainy': 'mdi-weather-rainy',
        'snowy': 'mdi-weather-snowy'
      }
      return icons[condition] || 'mdi-weather-cloudy'
    }

    // Lifecycle hooks
    onMounted(() => {
      fetchDestinationDetails()
    })

    return {
      // Estado
      loading,
      error,
      destination,
      shareDialog,
      socialNetworks,
      featuredReviews,
      rules,

      // Métodos
      fetchDestinationDetails,
      planTrip,
      shareDestination,
      copyLink,
      sendShareEmail,
      getInitials,
      formatDate,
      getWeatherIcon
    }
  }
}
</script>

<style scoped>
.destination-details {
  min-height: calc(100vh - var(--navbar-height));
}

.hero-content {
  position: relative;
  z-index: 2;
}

.error-state {
  max-width: 500px;
  margin: 48px auto;
}

.highlight-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.highlight-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.review-item:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding-bottom: 1rem;
}

.favorite-active {
  color: #ff4081 !important;
}

.map-preview {
  cursor: pointer;
  transition: all 0.3s ease;
}

.map-preview:hover {
  opacity: 0.9;
}

@media (max-width: 960px) {
  .hero-image {
    height: 400px !important;
  }
}

/* Soporte para modo oscuro */
:deep(.v-theme--dark) {
  .review-item:not(:last-child) {
    border-color: rgba(255, 255, 255, 0.12);
  }
}
</style>