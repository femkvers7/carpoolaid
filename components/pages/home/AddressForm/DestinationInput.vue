<script setup lang="ts">
import type { Location, MapboxLocation } from "~/types/Location";

const indexStore = useIndexStore();
const homeMapStore = useHomeMapStore();

const { isLoading } = storeToRefs(indexStore);
const { destinationLocation, carpoolLocations } = storeToRefs(homeMapStore);

const editDestination = ref<boolean>(false);

const onRetrieveDestinationLocation = async (location: MapboxLocation) => {
  isLoading.value = true;

  destinationLocation.value = location;

  if (editDestination.value || carpoolLocations.value.length > 0) {
    await homeMapStore.updateRoutes();
    homeMapStore.updateMapData(["markers", "routes"]);

    editDestination.value = false;
  } else {
    homeMapStore.updateMapData(["markers"]);
  }
  isLoading.value = false;
};

const toggleEditDestination = (e: Event) => {
  e.preventDefault();
  editDestination.value = !editDestination.value;
};
</script>

<template>
  <div class="mb-4">
    <div
      v-if="!!destinationLocation && editDestination == false"
      class="flex justify-between content-end my-2"
    >
      <p>{{ destinationLocation.place }}</p>
      <button class="flex items-center" @click="toggleEditDestination">
        <Icon fill="var(--purple)" size="16px" name="pencil-square" />
      </button>
    </div>
    <div
      v-show="!destinationLocation || editDestination"
      class="flex gap-4 w-full"
    >
      <MapboxInput
        id="location"
        name="location"
        @retrieve="onRetrieveDestinationLocation"
      />
      <button
        v-if="editDestination"
        class="flex items-center"
        @click="toggleEditDestination"
      >
        <Icon fill="var(--purple)" size="16px" name="cross" />
      </button>
    </div>
  </div>
</template>
