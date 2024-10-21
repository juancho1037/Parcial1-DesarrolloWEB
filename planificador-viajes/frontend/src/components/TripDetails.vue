<template>
  <div class="trip-details">
    <h2>{{ trip.destination }}</h2>
    <p>From {{ trip.startDate }} to {{ trip.endDate }}</p>
    <h3>Activities</h3>
    <ul v-if="trip.activities && trip.activities.length">
      <li v-for="activity in trip.activities" :key="activity.id">
        {{ activity.name }} - {{ activity.date }}
      </li>
    </ul>
    <p v-else>No activities planned yet.</p>
    <button @click="$emit('close')">Close</button>
  </div>
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
};
</script>

<style scoped>
.trip-details {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-top: 1rem;
}
</style>
