<script setup lang="ts">
import SavedTripList from "~/components/pages/profile/SavedTrips/SavedTripList.vue";
import { useProfileStore } from "../../stores/profile";

definePageMeta({
  title: "Saved Trips",
  layout: "profile",
});

const profileStore = useProfileStore();
const { activeTab } = storeToRefs(profileStore);

activeTab.value = "saved-trips";
</script>

<template>
  <SavedTripList />
</template>
