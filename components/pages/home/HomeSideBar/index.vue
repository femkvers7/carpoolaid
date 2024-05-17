<script setup lang="ts">
import mapboxgl from "mapbox-gl";

useHead({
  script: [
    {
      src: "https://api.mapbox.com/search-js/v1.0.0-beta.21/web.js",
      id: "search-js",
      defer: "",
    },
  ],
});

const homeMapStore = useHomeMapStore();
const { destinationLocation, carpoolLocations } = storeToRefs(homeMapStore);

const MAPBOX_API_KEY = useRuntimeConfig().public.mapboxAccessToken;
mapboxgl.accessToken = MAPBOX_API_KEY;
</script>

<template>
  <Popup
    height="calc(100vh - 2rem - 5.5rem)"
    width="400px"
    class="flex flex-col content-center justify-start overflow-y-auto"
  >
    <div class="flex justify-between items-center mb-4">
      <p class="text-lg">Your trip</p>

      <Button variant="neutral">
        <Icon fill="var(--purple)" size="16px" name="floppy" />
      </Button>
    </div>
    <div class="manual-input">
      <div class="destination">
        <div class="destination__title">
          <Icon fill="var(--purple)" size="16px" width="12px" name="pin" />
          <p>Choose a destination</p>
        </div>
        <DestinationInput />
      </div>
      <div class="carpool">
        <div class="carpool__title">
          <Icon fill="var(--purple)" size="16px" name="car" />
          <p>Choose your carpool locations</p>
        </div>
        <div v-if="destinationLocation">
          <CarpoolInput :initial-value="editValue" />
          <div class="mt-4 carpool-list">
            <CarpoolAddress
              v-for="location in carpoolLocations"
              :key="location.id"
              :location="location"
              @edit-location="onEditLocation"
            />
          </div>
          <!-- with initial value
        <CarpoolInput
          :initial-values="{
            id: '7d30d02c-a636-4d6c-b338-acc7d1427f98',
            coordinates: [3.7250121, 51.0538286],
            address: {
              country: 'Belgium',
              place: 'Gent',
              street: '',
              address_number: '',
            },
            name: '',
            carAvailable: true,
            carSeats: 4,
          }"
        />
        --></div>
        <span v-else class="subtle italic">
          Please select a destination to continue
        </span>
      </div>
    </div>
    <span
      v-show="destinationLocation && !carpoolLocations.length"
      class="m-auto italic"
      >or</span
    >
    <div
      v-show="destinationLocation && !carpoolLocations.length"
      class="upload-csv flex flex-col items-center"
    >
      <Icon fill="var(--lavender)" size="48px" name="upload" />
      <Button variant="tertiary">Upload CSV</Button>
    </div>
    <Button
      v-show="destinationLocation && carpoolLocations?.length > 1"
      variant="primary"
      class="mx-auto mt-auto mb-3"
    >
      Generate Carpoolplan
    </Button>
  </Popup>
</template>

<style lang="scss" scoped>
.destination__title,
.carpool__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0rem;
}

.carpool-list {
  padding-right: 0.5rem;
  max-height: calc(100vh - 36rem);
  overflow-y: auto;
}
</style>
