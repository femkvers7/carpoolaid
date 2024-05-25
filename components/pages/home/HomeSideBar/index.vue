<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import { useHomeSuggestionsStore } from "~/stores/home/suggestions";

const homeMapStore = useHomeMapStore();
const { destinationLocation, carpoolLocations } = storeToRefs(homeMapStore);

const homeCsvStore = useHomeCsvStore();

const homeSuggestionsStore = useHomeSuggestionsStore();

const MAPBOX_API_KEY = useRuntimeConfig().public.mapboxAccessToken;
mapboxgl.accessToken = MAPBOX_API_KEY;

// check if logged in
const jwt = useCookie("sb-access-token");
const isLoggedIn = computed(() => !!jwt.value);

const handleReset = () => {
  homeMapStore.reset();
  homeCsvStore.reset();
  homeSuggestionsStore.reset();
};
</script>

<template>
  <Popup class="sidebar">
    <div class="flex justify-between items-center mb-4">
      <p class="text-lg">Your trip</p>
      <div class="flex gap-3">
        <Tooltip content="Reset" position="left">
          <Button variant="neutral" @click="handleReset">
            <Icon fill="var(--purple)" size="16px" name="eraser" />
          </Button>
        </Tooltip>
        <Tooltip
          :content="isLoggedIn ? 'Save' : 'Log in to save trip'"
          position="left"
        >
          <Button variant="neutral" :disabled="!isLoggedIn">
            <Icon
              :fill="isLoggedIn ? 'var(--purple)' : 'var(--lavender)'"
              size="16px"
              name="floppy"
            />
          </Button>
        </Tooltip>
      </div>
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
          <CarpoolInput />
          <div class="mt-4 carpool-list">
            <CarpoolAddress
              v-for="location in carpoolLocations"
              :key="location.id"
              :location="location"
            />
          </div>
        </div>
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
    <UploadCsvButton v-show="destinationLocation && !carpoolLocations.length" />
    <SuggestionsButton
      v-show="destinationLocation && carpoolLocations?.length > 1"
    />
  </Popup>
</template>

<style lang="scss" scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: auto;
  padding: 1.5rem;
  height: calc(100vh - 2rem - 5.5rem);
  width: 400px;
}

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
