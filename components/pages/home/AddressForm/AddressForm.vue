<script setup lang="ts">
import type { Location } from "~/types/Location";
import { v4 as uuidv4 } from "uuid";

useHead({
  script: [
    {
      src: "https://api.mapbox.com/search-js/v1.0.0-beta.21/web.js",
      id: "search-js",
      defer: "",
    },
  ],
});

const MAPBOX_API_KEY = useRuntimeConfig().public.mapboxAccessToken;
const indexStore = useIndexStore();
const homeMapStore = useHomeMapStore();
const { isLoading } = storeToRefs(indexStore);
const { destinationLocation, carpoolLocations, routes } =
  storeToRefs(homeMapStore);

const onRetrieveCarpoolLocation = async (event: any) => {
  if (!destinationLocation.value) {
    window.alert("Please select a destination first.");
    return;
  }
  isLoading.value = true;

  const locationFeatures = event.detail.features[0];
  const carpoolLocation: Location = {
    id: uuidv4(),
    coordinates: locationFeatures.geometry.coordinates as number[],
    label: locationFeatures.properties.context.place?.name ?? "Carpool",
    address: {
      country: locationFeatures.properties.context.country?.name ?? "Belgium",
      place: locationFeatures.properties.context.place?.name ?? "",
      street: locationFeatures.properties.context.street?.name ?? "",
      address_number:
        locationFeatures.properties.context.address?.address_number ?? "",
    },
  };

  carpoolLocations.value.push(carpoolLocation);

  // compute route
  if (destinationLocation.value) {
    const route = await homeMapStore.getRoute(
      carpoolLocation,
      destinationLocation.value!,
    );

    routes.value.push(route);
    homeMapStore.updateMapData(["markers", "routes"]);
  } else {
    homeMapStore.updateMapData(["markers"]);
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
          :types="[
            'city',
            'street',
            'address',
            'postcode',
            'place',
            'locality',
            'neighborhood',
          ]"
          @retrieve="onRetrieveCarpoolLocation"
        >
        </mapbox-search-box>
      </div>
    </form>
  </div>
</template>
