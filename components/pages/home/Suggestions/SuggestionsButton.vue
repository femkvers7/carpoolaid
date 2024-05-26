<script setup lang="ts">
const homeMapStore = useHomeMapStore();
const { destinationLocation, routes } = storeToRefs(homeMapStore);

const homeSuggestionsStore = useHomeSuggestionsStore();
const { suggestions } = storeToRefs(homeSuggestionsStore);

const generateCarpoolPlan = async () => {
  // generate carpool plan
  const carpoolPlan = await $fetch("/api/suggestions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      destination: destinationLocation.value,
      routes: routes.value,
    },
  });

  console.log(carpoolPlan);
  suggestions.value = carpoolPlan;
};
</script>

<template>
  <Button
    variant="primary"
    class="mx-auto mt-auto mb-3"
    @click="generateCarpoolPlan"
  >
    Generate Carpoolplan
  </Button>
</template>
