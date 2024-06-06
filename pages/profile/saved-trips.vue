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

console.log(savedTrips, "savedTrips");

const handleRefresh = () => {
  getTripsByUserId(user.value!.id).then((res) => {
    savedTrips.value = res.data;
  });
};
</script>

<template>
  <SavedTripList
    :saved-trips="savedTrips?.reverse()"
    @refresh="handleRefresh"
  />
</template>
