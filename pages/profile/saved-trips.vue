<script setup lang="ts">
import SavedTripList from "~/components/pages/profile/SavedTrips/SavedTripList.vue";
import { useProfileStore } from "../../stores/profile";
import { getTripsByUserId } from "~/modules/api/trips";

definePageMeta({
  title: "Saved Trips",
  layout: "profile",
});

const indexStore = useIndexStore();
const { isLoading } = storeToRefs(indexStore);

const profileStore = useProfileStore();
const { activeTab } = storeToRefs(profileStore);

activeTab.value = "saved-trips";

const user = useSupabaseUser();
const { data, error } = await getTripsByUserId(user.value!.id);

const savedTrips = ref(data);

const handleRefresh = (tripId: string) => {
  savedTrips.value =
    savedTrips.value?.filter((trip) => trip.id !== tripId) ?? [];
  isLoading.value = false;
};
</script>

<template>
  <SavedTripList :saved-trips="savedTrips" @refresh="handleRefresh" />
</template>
