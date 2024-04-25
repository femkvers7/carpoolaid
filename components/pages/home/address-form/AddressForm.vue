<script setup lang="ts">
import type { Location } from "~/types/Location";

useHead({
  script: [
    {
      src: "https://api.mapbox.com/search-js/v1.0.0-beta.19/web.js",
      id: "search-js",
      defer: "",
    },
  ],
});

const MAPBOX_API_KEY = useRuntimeConfig().public.mapboxAccessToken;
const indexStore = useIndexStore();
const homeMapStore = useHomeMapStore();
const { isLoading } = storeToRefs(indexStore);
const {
  destinationLocation,
  carpoolLocations,
  routes,
  mapInstance,
  markersGeoJSON,
  routesGeoJSON,
} = storeToRefs(homeMapStore);

const onRetrieveCarpoolLocation = async (event: any) => {
  if (!destinationLocation.value) {
    window.alert("Please select a destination first.");
    return;
  }
  isLoading.value = true;

  const coordinates = event.detail.features[0].geometry.coordinates as number[];
  const carpoolLocation: Location = {
    coordinates: coordinates,
    context: event.detail.features[0].properties.context,
    full_address: event.detail.features[0].properties.full_address,
  };

  carpoolLocations.value.push(carpoolLocation);

  mapInstance.value!.getSource("markers").setData(markersGeoJSON.value);

  // compute route
  if (destinationLocation.value) {
    const route = await homeMapStore.getRoute(
      carpoolLocation.coordinates,
      destinationLocation.value!.coordinates,
    );

    routes.value.push(route);
    mapInstance.value!.getSource("routes").setData(routesGeoJSON.value);
  }
  isLoading.value = false;
};
</script>

<template>
  <div>
    <form>
      <DestinationAddress />
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="destination-address"
        >
          Selected Locations
        </label>
        <ol>
          <li v-for="(location, index) in carpoolLocations" :key="index">
            <CarpoolAddress :location="location" />
          </li>
        </ol>
        <mapbox-search-box
          :access-token="MAPBOX_API_KEY"
          :language="['nl']"
          @retrieve="onRetrieveCarpoolLocation"
        >
        </mapbox-search-box>
      </div>
    </form>
  </div>
</template>
