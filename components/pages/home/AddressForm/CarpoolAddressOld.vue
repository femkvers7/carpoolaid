<!-- old/outdated -->

<script setup lang="ts">
import type { Location } from "~/types/Location";

const props = defineProps({
  location: {
    type: Object as PropType<Location>,
    required: true,
  },
});

const indexStore = useIndexStore();
const homeMapStore = useHomeMapStore();

const { isLoading } = storeToRefs(indexStore);
const { carpoolLocations, routes } = storeToRefs(homeMapStore);

const editLocation = ref(false);

const toggleEditLocation = (e: Event) => {
  e.preventDefault();
  editLocation.value = !editLocation.value;
};

const deleteLocation = (e: Event) => {
  e.preventDefault();
  isLoading.value = true;

  carpoolLocations.value = carpoolLocations.value.filter(
    (loc) => loc.id !== props.location.id,
  );

  routes.value = routes.value.filter(
    (route: Route) => route.carpoolId !== props.location.id,
  );

  homeMapStore.updateMapData(["markers", "routes"]);
  isLoading.value = false;
};
</script>

<template>
  <div class="flex justify-between">
    <p>{{ location.label }}</p>
    <div class="flex gap-3">
      <button @click="toggleEditLocation">Edit</button>
      <button @click="deleteLocation">Remove</button>
    </div>
  </div>
</template>
