<script setup lang="ts">
import { useHomeMapStore } from "~/stores/maps/home";
import type { Location, LocationContext } from "~/types/Location";
import type { GeoJson } from "~/types/Routes";

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

const {
  destinationLocation,
  carpoolLocations,
  routes,
  mapInstance,
  destinationGeoJSON,
  carpoolGeoJSON,
  routeGeoJSON,
} = storeToRefs(homeMapStore);

const onRetrieveDestinationLocation = (event: any) => {
  const destination: Location = {
    coordinates: event.detail.features[0].geometry.coordinates as number[],
    context: event.detail.features[0].properties.context as LocationContext,
    full_address: event.detail.features[0].properties.full_address as string,
  };

  destinationLocation.value = destination;

  mapInstance.value.getSource("destination").setData(destinationGeoJSON.value);
};

const onRetrieveCarpoolLocation = (event: any) => {
  const coordinates = event.detail.features[0].geometry.coordinates as number[];
  const carpoolLocation: Location = {
    coordinates: coordinates,
    context: event.detail.features[0].properties.context,
    full_address: event.detail.features[0].properties.full_address,
  };

  carpoolLocations.value.push(carpoolLocation);

  console.log(carpoolGeoJSON.value, "carpoolGeoJSON");

  mapInstance.value.getSource("carpool").setData(carpoolGeoJSON.value);

  // compute route
  if (destinationLocation) {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates[0]},${coordinates[1]};${destinationLocation.value!.coordinates[0]},${destinationLocation.value!.coordinates[1]}?geometries=geojson&access_token=${MAPBOX_API_KEY}`;
    getRoute(url);
    console.log("routes", routes);
  }
};

const getRoute = async (url: string) => {
  const query = await fetch(url, {
    method: "GET",
  });
  const json = await query.json();
  const route = json.routes[0].geometry.coordinates;
  routes.value.push(route);

  mapInstance.value.getSource("route").setData(routeGeoJSON.value);
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
        <div v-if="!!destinationLocation">
          {{ destinationLocation?.full_address }}
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
          <li v-for="(location, index) in carpoolLocations" :key="index">
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
