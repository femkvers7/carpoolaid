<script setup lang="ts">
import { useHomeMapStore } from "~/stores/maps/home";
import type { Location, LocationContext } from "~/types/Location";

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
const homeMapStore = useHomeMapStore();

const onRetrieveDestinationLocation = (event: any) => {
  const destination: Location = {
    coordinates: event.detail.features[0].geometry.coordinates as number[],
    context: event.detail.features[0].properties.context as LocationContext,
    full_address: event.detail.features[0].properties.full_address as string,
  };

  homeMapStore.destinationLocation = destination;
};

const onRetrieveCarpoolLocation = (event: any) => {
  const carpoolLocation: Location = {
    coordinates: event.detail.features[0].geometry.coordinates,
    context: event.detail.features[0].properties.context,
    full_address: event.detail.features[0].properties.full_address,
  };

  homeMapStore.carpoolLocations.push(carpoolLocation);
};
</script>

<template>
  <div>
    <form>
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="destination-address"
        >
          Destination Address
        </label>
        <div v-if="!!homeMapStore.destinationLocation">
          {{ homeMapStore.destinationLocation?.full_address }}
        </div>
        <mapbox-search-box
          v-else
          :access-token="MAPBOX_API_KEY"
          @retrieve="onRetrieveDestinationLocation"
        >
        </mapbox-search-box>
      </div>
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="destination-address"
        >
          Selected Locations
        </label>
        <ol>
          <li
            v-for="(location, index) in homeMapStore.carpoolLocations"
            :key="index"
          >
            {{ location.full_address }}
          </li>
        </ol>
        <mapbox-search-box
          :access-token="MAPBOX_API_KEY"
          @retrieve="onRetrieveCarpoolLocation"
        >
        </mapbox-search-box>
      </div>
    </form>
  </div>
</template>
