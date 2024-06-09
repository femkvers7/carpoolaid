<script setup lang="ts">
import type { Tables } from "~/types/supabase";

defineProps<{
  savedTrips: (Tables<"trips"> & { locations: Tables<"locations">[] })[] | null;
}>();

const emit = defineEmits(["refresh"]);

const handleRefresh = () => {
  emit("refresh", true);
};
</script>

<template>
  <ul v-if="savedTrips && savedTrips.length">
    <SavedTripListItem
      v-for="trip in savedTrips"
      :key="trip.id"
      :trip="trip"
      @refresh="handleRefresh"
    />
  </ul>
  <p v-else>No saved trips</p>
</template>
