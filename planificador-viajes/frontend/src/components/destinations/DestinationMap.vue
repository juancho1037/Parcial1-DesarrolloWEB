<template>
  <div class="destination-map">
    <v-card class="map-container" :class="{ 'expanded': isExpanded }" @click="toggleExpand">
      <!-- Contenedor del mapa -->
      <div ref="mapContainer" class="map-element"></div>

      <!-- Loading overlay -->
      <v-overlay v-if="loading" :model-value="loading" class="align-center justify-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-overlay>

      <!-- Error overlay -->
      <v-overlay v-if="error" :model-value="error" class="align-center justify-center">
        <v-card class="pa-4 text-center">
          <v-icon color="error" size="48" class="mb-2">mdi-map-marker-alert</v-icon>
          <div class="text-body-1">Error al cargar el mapa</div>
          <v-btn color="primary" class="mt-4" @click="initMap">
            Reintentar
          </v-btn>
        </v-card>
      </v-overlay>

      <!-- Controles del mapa -->
      <div class="map-controls pa-2">
        <v-btn-group>
          <v-btn icon="mdi-plus" size="small" @click.stop="zoomIn"></v-btn>
          <v-btn icon="mdi-minus" size="small" @click.stop="zoomOut"></v-btn>
        </v-btn-group>

        <v-btn icon="mdi-layers" size="small" class="ml-2" @click.stop="toggleMapType"></v-btn>

        <v-btn icon="mdi-fullscreen" size="small" class="ml-2" @click.stop="toggleExpand"></v-btn>
      </div>

      <!-- Points of Interest -->
      <div v-if="showPOIs" class="points-of-interest pa-2">
        <v-expansion-panels>
          <v-expansion-panel v-for="category in poiCategories" :key="category.name">
            <v-expansion-panel-title>
              <v-icon :color="category.color" class="mr-2">
                {{ category.icon }}
              </v-icon>
              {{ category.name }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list density="compact">
                <v-list-item v-for="poi in category.points" :key="poi.id" :title="poi.name" :subtitle="poi.description"
                  @click="centerOnPOI(poi)">
                  <template v-slot:prepend>
                    <v-icon :color="category.color" size="small">
                      {{ poi.icon }}
                    </v-icon>
                  </template>
                  <template v-slot:append>
                    <v-btn icon="mdi-directions" size="small" variant="text" @click.stop="getDirections(poi)"></v-btn>
                  </template>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>

      <!-- Info Window Content -->
      <v-card v-if="selectedPlace" class="place-info pa-4" elevation="4">
        <div class="d-flex align-center mb-2">
          <v-icon :color="selectedPlace.category?.color" class="mr-2">
            {{ selectedPlace.icon }}
          </v-icon>
          <div class="text-subtitle-1 font-weight-medium">
            {{ selectedPlace.name }}
          </div>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" size="small" variant="text" @click.stop="selectedPlace = null"></v-btn>
        </div>
        <p class="text-body-2 mb-2">{{ selectedPlace.description }}</p>
        <div class="d-flex">
          <v-btn variant="text" density="comfortable" prepend-icon="mdi-directions"
            @click.stop="getDirections(selectedPlace)">
            Cómo llegar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn variant="text" density="comfortable" prepend-icon="mdi-information"
            @click.stop="showPlaceDetails(selectedPlace)">
            Más info
          </v-btn>
        </div>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import { useAppStore } from '@/stores/app'

export default {
  name: 'DestinationMap',

  props: {
    location: {
      type: Object,
      required: true,
      validator: (value) => {
        return value.lat !== undefined && value.lng !== undefined
      }
    },
    showPOIs: {
      type: Boolean,
      default: true
    },
    zoom: {
      type: Number,
      default: 13
    }
  },

  setup(props) {
    const appStore = useAppStore()
    const mapContainer = ref(null)
    const map = ref(null)
    const markers = ref([])
    const selectedPlace = ref(null)
    const isExpanded = ref(false)
    const loading = ref(true)
    const error = ref(false)

    // Google Maps loader
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places']
    })

    // Inicializar mapa
    const initMap = async () => {
      loading.value = true
      error.value = false

      try {
        // Cargar Google Maps
        const google = await loader.load()

        // Crear nueva instancia del mapa
        map.value = new google.maps.Map(mapContainer.value, {
          center: props.location,
          zoom: props.zoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: getMapStyles() // Función que retorna estilos personalizados
        })

        // Agregar marcador principal
        const mainMarker = new google.maps.Marker({
          position: props.location,
          map: map.value,
          title: 'Ubicación principal',
          animation: google.maps.Animation.DROP
        })

        // Agregar marcadores de POIs
        if (props.showPOIs) {
          poiCategories.forEach(category => {
            category.points.forEach(poi => {
              const marker = new google.maps.Marker({
                position: poi.location,
                map: map.value,
                title: poi.name,
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: category.color,
                  fillOpacity: 1,
                  strokeWeight: 1,
                  scale: 8
                }
              })

              // Agregar evento click al marcador
              marker.addListener('click', () => {
                selectedPlace.value = poi
              })

              markers.value.push(marker)
            })
          })
        }

      } catch (err) {
        console.error('Error al inicializar el mapa:', err)
        error.value = true
        appStore.showSnackbar({
          text: 'Error al cargar el mapa',
          color: 'error'
        })
      } finally {
        loading.value = false
      }
    }

    // Estilos personalizados del mapa
    const getMapStyles = () => {
      // Aquí puedes definir estilos personalizados para el mapa
      return [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        // Más estilos personalizados...
      ]
    }

    // Métodos del mapa
    const zoomIn = () => {
      if (map.value) {
        map.value.setZoom(map.value.getZoom() + 1)
      }
    }

    const zoomOut = () => {
      if (map.value) {
        map.value.setZoom(map.value.getZoom() - 1)
      }
    }

    const toggleMapType = () => {
      if (map.value) {
        const currentType = map.value.getMapTypeId()
        const newType = currentType === 'roadmap' ? 'satellite' : 'roadmap'
        map.value.setMapTypeId(newType)
      }
    }

    const centerOnPOI = (poi) => {
      if (map.value) {
        map.value.panTo(poi.location)
        map.value.setZoom(16)
        selectedPlace.value = poi
      }
    }

    const getDirections = (place) => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${place.location.lat},${place.location.lng}`
      window.open(url, '_blank')
    }

    const showPlaceDetails = (place) => {
      // Implementar lógica para mostrar detalles
      appStore.showSnackbar({
        text: `Mostrando detalles de: ${place.name}`,
        color: 'info'
      })
    }

    // Limpieza de marcadores
    const clearMarkers = () => {
      markers.value.forEach(marker => marker.setMap(null))
      markers.value = []
    }

    // Lifecycle hooks
    onMounted(() => {
      initMap()
    })

    onUnmounted(() => {
      clearMarkers()
    })

    // Observar cambios en la ubicación
    watch(() => props.location, (newLocation) => {
      if (map.value) {
        map.value.panTo(newLocation)
      }
    })

    return {
      mapContainer,
      loading,
      error,
      selectedPlace,
      isExpanded,
      poiCategories,
      zoomIn,
      zoomOut,
      toggleMapType,
      centerOnPOI,
      getDirections,
      showPlaceDetails,
      initMap
    }
  }
}
</script>

<style scoped>
.destination-map {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-container {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.map-container.expanded {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
}

.map-element {
  width: 100%;
  height: 100%;
}

.map-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  backdrop-filter: blur(4px);
}

.points-of-interest {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 300px;
  max-height: calc(100% - 20px);
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  backdrop-filter: blur(4px);
}

.place-info {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  max-width: 400px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
}

/* Soporte para modo oscuro */
:deep(.v-theme--dark) {

  .map-controls,
  .points-of-interest,
  .place-info {
    background: rgba(30, 30, 30, 0.9);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .points-of-interest {
    width: calc(100% - 20px);
    max-height: 200px;
  }

  .map-container {
    height: 300px;
  }
}
</style>