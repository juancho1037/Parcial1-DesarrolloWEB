<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4">Mis Viajes</h1>
      <v-btn color="primary" @click="showAddTripDialog = true">
        Nuevo Viaje
      </v-btn>
    </div>

    <!-- Lista de Viajes -->
    <v-row>
      <v-col v-for="trip in trips" :key="trip.id" cols="12" md="6">
        <v-card>
          <v-card-title>{{ trip.destination }}</v-card-title>
          <v-card-subtitle>
            {{ formatDate(trip.startDate) }} -
            {{ formatDate(trip.endDate) }} ({{ trip.numberOfDays }} días)
          </v-card-subtitle>
          <v-card-text>
            <div v-if="trip.activities && trip.activities.length">
              <strong>Actividades planificadas:</strong>
              {{ trip.activities.length }}
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

    <!-- Mensaje cuando no hay viajes -->
    <v-alert v-if="!trips.length" type="info" class="mt-4">
      No tienes viajes planificados. ¡Crea uno nuevo!
    </v-alert>

    <!-- Diálogo para añadir nuevo viaje -->
    <v-dialog v-model="showAddTripDialog" max-width="600px">
      <v-card>
        <v-card-title>Nuevo Viaje</v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent="submitNewTrip">
            <v-text-field
              v-model="newTrip.destination"
              label="Destino"
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
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" text @click="showAddTripDialog = false">
                Cancelar
              </v-btn>
              <v-btn color="primary" type="submit"> Guardar </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Diálogo para detalles del viaje -->
    <v-dialog v-model="showTripDetailsDialog" max-width="800px">
      <v-card v-if="selectedTrip">
        <v-card-title>{{ selectedTrip.destination }}</v-card-title>
        <v-card-subtitle>
          {{ formatDate(selectedTrip.startDate) }} -
          {{ formatDate(selectedTrip.endDate) }}
        </v-card-subtitle>
        <v-card-text>
          <h3 class="text-h6 mb-3">Actividades</h3>
          <v-list
            v-if="selectedTrip.activities && selectedTrip.activities.length"
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
          <v-alert v-else type="info">
            No hay actividades planificadas para este viaje.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showTripDetailsDialog = false">
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
      // Simulamos una llamada a API
      await new Promise((resolve) => setTimeout(resolve, 500));
      this.trips = SAMPLE_TRIPS;
    },
    showTripDetails(trip) {
      this.selectedTrip = trip;
      this.showTripDetailsDialog = true;
    },
    formatDate(dateString) {
      if (!dateString) return "";
      return new Date(dateString).toLocaleDateString();
    },
    submitNewTrip() {
      // Calcular número de días
      const start = new Date(this.newTrip.startDate);
      const end = new Date(this.newTrip.endDate);
      const numberOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      const trip = {
        id: Date.now().toString(), // ID temporal
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
