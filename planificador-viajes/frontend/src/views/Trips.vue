<!-- src/views/Trips.vue -->
<template>
  <div class="trips">
    <h2>My Trips</h2>
    <ul v-if="trips.length">
      <li v-for="trip in trips" :key="trip.id">
        {{ trip.destination }} ({{ trip.startDate }} - {{ trip.endDate }})
      </li>
    </ul>
    <p v-else>No trips planned yet. Start by adding a new trip!</p>
    <button @click="addTrip">Add New Trip</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Trips",
  data() {
    return {
      trips: [],
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
    addTrip() {
      // TODO: Implement add trip functionality
      console.log("Add trip clicked");
    },
  },
  mounted() {
    this.fetchTrips();
  },
};
</script>
