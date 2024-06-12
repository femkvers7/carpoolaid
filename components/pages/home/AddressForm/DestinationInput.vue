<script setup lang="ts">
import type { LngLatLike } from "mapbox-gl";
import type { Location } from "~/types/Location";

const indexStore = useIndexStore();
const homeMapStore = useHomeMapStore();
const suggestionsStore = useHomeSuggestionsStore();

const { isLoading } = storeToRefs(indexStore);
const { destinationLocation, carpoolLocations } = storeToRefs(homeMapStore);

const editDestination = ref<boolean>(false);
const isHovering = ref(false);

const onRetrieveDestinationLocation = async (location: Location) => {
  isLoading.value = true;

  destinationLocation.value = location;

  if (editDestination.value || carpoolLocations.value.length > 0) {
    await homeMapStore.updateRoutes();
    homeMapStore.updateMapData(["markers", "routes"]);
    suggestionsStore.reset();

    editDestination.value = false;
  } else {
    homeMapStore.updateMapData(["markers"]);
  }
  isLoading.value = false;
};

const toggleEditDestination = (e: Event) => {
  isLoading.value = true;
  editDestination.value = !editDestination.value;
  isLoading.value = false;
};

const handleDestinationHover = () => {
  isHovering.value = true;
  homeMapStore.setPopup(
    destinationLocation.value!.coordinates as LngLatLike,
    `
      <h2>${destinationLocation.value?.place}</h2>
      <p>Destination</p>
    `,
  );
};

const handleDestinationLeave = () => {
  isHovering.value = false;
  homeMapStore.removePopup();
};
</script>

<template>
  <div class="mb-4">
    <div
      v-if="!!destinationLocation && editDestination == false"
      class="flex justify-between content-end my-2"
      :class="{
        'font-bold': isHovering,
      }"
      @mouseover="handleDestinationHover"
      @mouseleave="handleDestinationLeave"
    >
      <p>{{ destinationLocation.place }}</p>
      <button class="flex items-center" @click.prevent="toggleEditDestination">
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
