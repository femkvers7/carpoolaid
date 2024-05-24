<script setup lang="ts">
const savedTrips: Object[] = [
  {
    name: "Trip 1",
    id: 1,
    destination: "Destination address",
  },
  {
    name: "Trip 2",
    id: 2,
    destination: "Destination address",
  },
  {
    name: "Trip 3",
    id: 3,
    destination: "Destination address",
  },
];
</script>

<template>
  <ul>
    <SavedTripListItem v-for="trip in savedTrips" :key="trip.id" :trip="trip" />
  </ul>
</template>
