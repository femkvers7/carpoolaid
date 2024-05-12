<script setup lang="ts">
import type { Location } from "~/types/Location";
import { v4 as uuidv4 } from "uuid";

const indexStore = useIndexStore();
const homeMapStore = useHomeMapStore();

const { isLoading } = storeToRefs(indexStore);
const { destinationLocation, carpoolLocations } = storeToRefs(homeMapStore);
const MAPBOX_API_KEY = useRuntimeConfig().public.mapboxAccessToken;

const editDestination = ref<boolean>(false);

const onRetrieveDestinationLocation = async (event: any) => {
  isLoading.value = true;

  const locationFeatures = event.detail.features[0];
  const destination: Location = {
    id: uuidv4(),
    coordinates: locationFeatures.geometry.coordinates as number[],
    label: locationFeatures.properties.context.place?.name ?? "Destination",
    address: {
      country: locationFeatures.properties.context.country?.name ?? "Belgium",
      place: locationFeatures.properties.context.place?.name ?? "",
      street: locationFeatures.properties.context.street?.name ?? "",
      address_number:
        locationFeatures.properties.context.address?.address_number ?? "",
    },
  };

  destinationLocation.value = destination;

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
    <label
      class="block text-gray-700 text-sm font-bold mb-2"
      for="destination-address"
    >
      Destination Address
    </label>
    <div
      v-if="!!destinationLocation && editDestination == false"
      class="flex justify-between"
    >
      <p>{{ destinationLocation?.label }}</p>
      <button @click="toggleEditDestination">Edit</button>
    </div>
    <div
      v-if="!destinationLocation || editDestination"
      class="flex gap-4 w-full"
    >
      <mapbox-search-box
        :access-token="MAPBOX_API_KEY"
        :language="['nl']"
        :types="[
          'city',
          'street',
          'address',
          'postcode',
          'place',
          'locality',
          'neighborhood',
        ]"
        class="w-full"
        @retrieve="onRetrieveDestinationLocation"
      >
      </mapbox-search-box>
      <button v-if="editDestination" @click="toggleEditDestination">
        Cancel
      </button>
    </div>
  </div>
</template>
