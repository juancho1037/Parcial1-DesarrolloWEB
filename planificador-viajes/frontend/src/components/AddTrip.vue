<template>
  <v-card class="mx-auto mt-5" max-width="500">
    <v-card-title>Añadir Nuevo Viaje</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitTrip">
        <v-text-field
          v-model="trip.destination"
          label="Destino"
          required
        ></v-text-field>
        <v-row>
          <v-col cols="6">
            <v-date-picker
              v-model="trip.startDate"
              label="Fecha de inicio"
              required
            ></v-date-picker>
          </v-col>
          <v-col cols="6">
            <v-date-picker
              v-model="trip.endDate"
              label="Fecha de fin"
              required
            ></v-date-picker>
          </v-col>
        </v-row>
        <v-btn type="submit" color="primary" block class="mt-2">
          Añadir Viaje
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
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
