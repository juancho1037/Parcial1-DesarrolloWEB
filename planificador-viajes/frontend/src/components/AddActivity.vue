<template>
  <v-container>
    <h1 class="text-h4 mb-5">Mis Viajes</h1>
    <add-trip @trip-added="addTrip" />
    <v-divider class="my-5"></v-divider>
    <v-list v-if="trips.length">
      <v-list-item
        v-for="trip in trips"
        :key="trip.id"
        @click="showTripDetails(trip)"
      >
        <v-list-item-content>
          <v-list-item-title class="text-h6">{{
            trip.destination
          }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ formatDate(trip.startDate) }} -
            {{ formatDate(trip.endDate) }} ({{ trip.numberOfDays }} días)
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-alert v-else type="info">
      No tienes viajes planificados. ¡Crea uno nuevo!
    </v-alert>
    <trip-details
      v-if="selectedTrip"
      :trip="selectedTrip"
      @close="selectedTrip = null"
    />
  </v-container>
</template>

<script>
import axios from "axios";
import AddTrip from "@/components/AddTrip.vue";
import TripDetails from "@/components/TripDetails.vue";

export default {
  name: "Trips",
  components: {
    AddTrip,
    TripDetails,
  },
  data() {
    return {
      trips: [],
      selectedTrip: null,
    };
  },
  methods: {
    async fetchTrips() {
      try {
        const response = await axios.get("http://localhost:3000/trips");
        this.trips = response.data;
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    },
    addTrip(newTrip) {
      this.trips.push(newTrip);
    },
    showTripDetails(trip) {
      this.selectedTrip = trip;
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },
  },
  mounted() {
    this.fetchTrips();
  },
};
</script>
