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
const { data, error } = await getTripsByUserId(user.value!.id);

const savedTrips = ref(data);

const handleRefresh = () => {
  getTripsByUserId(user.value!.id).then((res) => {
    const trips = res.data;
    savedTrips.value = trips?.reverse() ?? [];
  });
};
</script>

<template>
  <SavedTripList :saved-trips="savedTrips" @refresh="handleRefresh" />
</template>
