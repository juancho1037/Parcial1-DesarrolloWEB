<template>
  <div class="trips">
    <h2>My Trips</h2>
    <AddTrip @trip-added="addTrip" />
    <ul v-if="trips.length">
      <li v-for="trip in trips" :key="trip.id">
        {{ trip.destination }} ({{ trip.startDate }} - {{ trip.endDate }})
      </li>
    </ul>
    <p v-else>No trips planned yet. Start by adding a new trip!</p>
  </div>
</template>

<script>
import axios from "axios";
import AddTrip from "@/components/AddTrip.vue";

export default {
  name: "Trips",
  components: {
    AddTrip,
  },
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
    addTrip(newTrip) {
      this.trips.push(newTrip);
    },
  },
  mounted() {
    this.fetchTrips();
  },
};
</script>
