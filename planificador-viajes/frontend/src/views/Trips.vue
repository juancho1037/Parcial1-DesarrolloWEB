<template>
  <v-container class="trips-container">
    <!-- Header Section -->
    <v-row class="header-section mb-8">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center">
          <h1 class="text-h3 font-weight-bold">Mis Viajes</h1>
          <v-btn
            color="primary"
            size="large"
            prepend-icon="mdi-plus"
            elevation="2"
            @click="showAddTripDialog = true"
          >
            NUEVO VIAJE
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Trips Grid -->
    <v-row v-if="trips && trips.length > 0">
      <v-col v-for="trip in trips" :key="trip.id" cols="12" md="6" lg="4">
        <v-card class="trip-card" elevation="3">
          <v-card-title>{{ trip.destination }}</v-card-title>
          <v-card-text>
            <div class="mb-2">
              {{ formatDate(trip.startDate) }} - {{ formatDate(trip.endDate) }}
              <v-chip class="ml-2" color="primary" size="small">
                {{ trip.numberOfDays }} días
              </v-chip>
            </div>
            <div>
              Actividades planificadas: {{ (trip.activities || []).length }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              variant="text"
              @click="showTripDetails(trip)"
            >
              Ver Detalles
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-else justify="center" class="mt-16">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <v-icon size="x-large" color="grey" class="mb-4"
          >mdi-map-marker-question</v-icon
        >
        <h3 class="text-h5 mb-2">¡No tienes viajes planificados!</h3>
        <p class="text-body-1 text-grey mb-6">
          Comienza tu aventura creando tu primer viaje.
        </p>
        <v-btn
          color="primary"
          size="large"
          prepend-icon="mdi-plus"
          @click="showAddTripDialog = true"
        >
          Crear mi primer viaje
        </v-btn>
      </v-col>
    </v-row>

    <!-- New Trip Dialog -->
    <v-dialog v-model="showAddTripDialog" width="600">
      <v-card>
        <v-card-title>Nuevo Viaje</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitNewTrip">
            <v-text-field
              v-model="newTrip.destination"
              label="¿A dónde viajarás?"
              required
            ></v-text-field>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="newTrip.startDate"
                  label="Fecha de inicio"
                  type="date"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="newTrip.endDate"
                  label="Fecha de fin"
                  type="date"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showAddTripDialog = false">
            Cancelar
          </v-btn>
          <v-btn color="primary" @click="submitNewTrip"> Crear Viaje </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Trip Details Dialog -->
    <v-dialog v-model="showTripDetailsDialog" width="800">
      <v-card v-if="selectedTrip">
        <v-card-title>{{ selectedTrip.destination }}</v-card-title>
        <v-card-text>
          <div class="mb-4">
            {{ formatDate(selectedTrip.startDate) }} -
            {{ formatDate(selectedTrip.endDate) }} ({{
              selectedTrip.numberOfDays
            }}
            días)
          </div>

          <h3 class="text-h6 mb-2">Actividades</h3>
          <v-list
            v-if="selectedTrip.activities && selectedTrip.activities.length > 0"
          >
            <v-list-item
              v-for="activity in selectedTrip.activities"
              :key="activity.id"
            >
              <v-list-item-title>{{ activity.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ activity.category }} - {{ formatDate(activity.date) }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <v-alert v-else type="info" class="mt-2">
            No hay actividades planificadas para este viaje.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showTripDetailsDialog = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// Datos de prueba
const SAMPLE_TRIPS = [
  {
    id: "1",
    destination: "París",
    startDate: "2024-12-20",
    endDate: "2024-12-27",
    numberOfDays: 7,
    activities: [
      {
        id: "1",
        name: "Visita a la Torre Eiffel",
        category: "Turismo",
        date: "2024-12-21",
      },
      {
        id: "2",
        name: "Cena en Le Cheval Blanc",
        category: "Gastronomía",
        date: "2024-12-22",
      },
    ],
  },
  {
    id: "2",
    destination: "Roma",
    startDate: "2025-01-15",
    endDate: "2025-01-22",
    numberOfDays: 7,
    activities: [
      {
        id: "3",
        name: "Visita al Coliseo",
        category: "Turismo",
        date: "2025-01-16",
      },
    ],
  },
];

export default {
  name: "Trips",
  data() {
    return {
      trips: [],
      selectedTrip: null,
      showAddTripDialog: false,
      showTripDetailsDialog: false,
      newTrip: {
        destination: "",
        startDate: "",
        endDate: "",
      },
    };
  },
  methods: {
    async fetchTrips() {
      try {
        // Simulamos una llamada a API
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.trips = SAMPLE_TRIPS;
      } catch (error) {
        console.error("Error fetching trips:", error);
        this.trips = []; // Aseguramos que trips sea al menos un array vacío
      }
    },
    formatDate(dateString) {
      if (!dateString) return "";
      return new Date(dateString).toLocaleDateString();
    },
    showTripDetails(trip) {
      this.selectedTrip = trip;
      this.showTripDetailsDialog = true;
    },
    submitNewTrip() {
      const start = new Date(this.newTrip.startDate);
      const end = new Date(this.newTrip.endDate);
      const numberOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      const trip = {
        id: Date.now().toString(),
        ...this.newTrip,
        numberOfDays,
        activities: [],
      };

      this.trips.push(trip);
      this.showAddTripDialog = false;
      this.newTrip = {
        destination: "",
        startDate: "",
        endDate: "",
      };
    },
  },
  mounted() {
    this.fetchTrips();
  },
};
</script>

<style scoped>
.trips-container {
  max-width: 1400px;
}

.trip-card {
  transition: transform 0.3s ease;
}

.trip-card:hover {
  transform: translateY(-5px);
}
</style>
