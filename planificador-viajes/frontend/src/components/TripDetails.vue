<template>
  <v-card class="mx-auto mt-5" max-width="800">
    <v-card-title class="text-h4">{{ trip.destination }}</v-card-title>
    <v-card-subtitle>
      {{ formatDate(trip.startDate) }} - {{ formatDate(trip.endDate) }} ({{
        trip.numberOfDays
      }}
      días)
    </v-card-subtitle>
    <v-card-text>
      <h3 class="text-h5 mb-3">Actividades</h3>
      <v-list v-if="trip.activities && trip.activities.length">
        <v-list-item v-for="activity in trip.activities" :key="activity.id">
          <v-list-item-title>{{ activity.name }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ activity.category }} - {{ formatDate(activity.date) }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-alert v-else type="info">No hay actividades planificadas aún.</v-alert>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="$emit('close')">Cerrar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "TripDetails",
  props: {
    trip: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "";
      return new Date(dateString).toLocaleDateString();
    },
  },
};
</script>
