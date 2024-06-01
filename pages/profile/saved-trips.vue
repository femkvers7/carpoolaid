<script setup lang="ts">
import SavedTripList from "~/components/pages/profile/SavedTrips/SavedTripList.vue";
import { useProfileStore } from "../../stores/profile";
import { getTripsByUserId } from "~/modules/api/trips";

definePageMeta({
  title: "Saved Trips",
  layout: "profile",
});

const profileStore = useProfileStore();
const { activeTab } = storeToRefs(profileStore);

activeTab.value = "saved-trips";

const user = useSupabaseUser();
const userId = user.value!.id;

const trips = await getTripsByUserId(userId!);
console.log(trips, "trips");
</script>

<template>
  <SavedTripList />
</template>
