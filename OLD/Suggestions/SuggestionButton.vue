<script setup lang="ts">
const homeMapStore = useHomeMapStore();
const { suggestions, routes, destinationLocation } = storeToRefs(homeMapStore);

const indexStore = useIndexStore();
const { showSuggestions, isLoading } = storeToRefs(indexStore);

const handleSuggestionSubmit = async () => {
  isLoading.value = true;
  // give suggestions
  const result2 = await $fetch("/api/suggestions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      destination: destinationLocation.value,
      routes: routes.value,
    },
  });

  suggestions.value = result2;
  showSuggestions.value = true;
  isLoading.value = false;
};

const disabled = computed(() => !(routes.value.length > 1));
</script>

<template>
  <ButtonPrimary :disabled="disabled" @submit="handleSuggestionSubmit">
    Generate suggestions
  </ButtonPrimary>
</template>
async
