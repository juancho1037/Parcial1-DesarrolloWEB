<template>
  <div class="add-trip">
    <h2>Add New Trip</h2>
    <form @submit.prevent="submitTrip">
      <div>
        <label for="destination">Destination:</label>
        <input id="destination" v-model="trip.destination" required />
      </div>
      <div>
        <label for="startDate">Start Date:</label>
        <input id="startDate" type="date" v-model="trip.startDate" required />
      </div>
      <div>
        <label for="endDate">End Date:</label>
        <input id="endDate" type="date" v-model="trip.endDate" required />
      </div>
      <button type="submit">Add Trip</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AddTrip",
  data() {
    return {
      trip: {
        destination: "",
        startDate: "",
        endDate: "",
      },
    };
  },
  methods: {
    async submitTrip() {
      try {
        const response = await axios.post(
          "http://localhost:3000/trips",
          this.trip
        );
        console.log("Trip added:", response.data);
        this.$emit("trip-added", response.data);
        this.resetForm();
      } catch (error) {
        console.error("Error adding trip:", error);
      }
    },
    resetForm() {
      this.trip = {
        destination: "",
        startDate: "",
        endDate: "",
      };
    },
  },
};
</script>

<style scoped>
.add-trip {
  max-width: 400px;
  margin: 0 auto;
}
form div {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
}
input {
  width: 100%;
  padding: 0.5rem;
}
button {
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
}
</style>
