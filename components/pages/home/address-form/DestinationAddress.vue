<script setup lang="ts">
import { useHomeMapStore } from "~/stores/maps/home";
import type { Location } from "~/types/Location";

const homeMapStore = useHomeMapStore();
const {
  mapInstance,
  destinationLocation,
  carpoolLocations,
  routes,
  markersGeoJSON,
  routesGeoJSON,
} = storeToRefs(homeMapStore);
const MAPBOX_API_KEY = useRuntimeConfig().public.mapboxAccessToken;

const editDestination = ref<boolean>(false);

const onRetrieveDestinationLocation = (event: any) => {
  const destination: Location = {
    coordinates: event.detail.features[0].geometry.coordinates as number[],
    context: event.detail.features[0].properties.context as LocationContext,
    full_address: event.detail.features[0].properties.full_address as string,
  };

  destinationLocation.value = destination;
  mapInstance.value.getSource("markers").setData(markersGeoJSON.value);

  if (editDestination.value) {
    updateRoutes();

    mapInstance.value.getSource("routes").setData(routesGeoJSON.value);
    editDestination.value = false;
  }
};

const updateRoutes = async () => {
  routes.value = [];

  carpoolLocations.value.forEach(async (location) => {
    const route = await homeMapStore.getRoute(
      location.coordinates,
      destinationLocation.value!.coordinates,
    );

    routes.value.push(route);
  });
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
      <p>{{ destinationLocation?.full_address }}</p>
      <button @click="toggleEditDestination">Edit</button>
    </div>
    <div
      v-if="!destinationLocation || editDestination"
      class="flex gap-4 w-full"
    >
      <mapbox-search-box
        :access-token="MAPBOX_API_KEY"
        :language="['nl']"
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
