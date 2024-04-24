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
const editDestination = ref<boolean>(false);

const {
  destinationLocation,
  carpoolLocations,
  routes,
  mapInstance,
  markersGeoJSON,
  routesGeoJSON,
} = storeToRefs(homeMapStore);

const onRetrieveDestinationLocation = (event: any) => {
  const destination: Location = {
    coordinates: event.detail.features[0].geometry.coordinates as number[],
    context: event.detail.features[0].properties.context as LocationContext,
    full_address: event.detail.features[0].properties.full_address as string,
  };

  destinationLocation.value = destination;

  mapInstance.value.getSource("markers").setData(markersGeoJSON.value);
};

const onRetrieveCarpoolLocation = async (event: any) => {
  if (!destinationLocation.value) {
    window.alert("Please select a destination first.");
    return;
  }

  const coordinates = event.detail.features[0].geometry.coordinates as number[];
  const carpoolLocation: Location = {
    coordinates: coordinates,
    context: event.detail.features[0].properties.context,
    full_address: event.detail.features[0].properties.full_address,
  };

  carpoolLocations.value.push(carpoolLocation);

  mapInstance.value.getSource("markers").setData(markersGeoJSON.value);

  // compute route
  if (destinationLocation.value) {
    const route = await getRoute(
      carpoolLocation.coordinates,
      destinationLocation.value!.coordinates,
    );

    routes.value.push(route);
    mapInstance.value.getSource("routes").setData(routesGeoJSON.value);
  }
};

const getRoute = async (
  carpoolCoords: number[],
  destinationCoords: number[],
) => {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${carpoolCoords[0]},${carpoolCoords[1]};${destinationCoords[0]},${destinationCoords[1]}?geometries=geojson&access_token=${MAPBOX_API_KEY}`;
  const query = await fetch(url, {
    method: "GET",
  });
  const json = await query.json();
  const route = {
    geometry: json.routes[0].geometry.coordinates,
    carpoolCoords: carpoolCoords,
    destinationCoords: destinationCoords,
  };

  return route;
};

// Edit destination location

const toggleEditRecord = (e: Event) => {
  e.preventDefault();
  editDestination.value = !editDestination.value;
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
        <div
          v-if="!!destinationLocation && editDestination == false"
          class="flex justify-between"
        >
          <p>{{ destinationLocation?.full_address }}</p>
          <button @click="toggleEditRecord">Edit</button>
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
          <button v-if="editDestination" @click="toggleEditRecord">
            Cancel
          </button>
        </div>
      </div>
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="destination-address"
        >
          Selected Locations
        </label>
        <ol>
          <li v-for="(location, index) in carpoolLocations" :key="index">
            <AddressLine :location="location" />
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
