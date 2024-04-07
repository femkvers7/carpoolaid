<script setup>
import { useHomeMapStore } from "~/stores/maps/home";

const homeMapStore = useHomeMapStore();
</script>

<template>
  <div class="map-container">
    <MapboxMap
      map-id="map_home"
      :options="{
        center: [4.2667145, 50.96402809],
        zoom: 8,
      }"
    >
      <MapboxDefaultMarker
        v-if="homeMapStore.destinationLocation"
        :marker-id="`location_destination`"
        :options="{
          color: 'red',
        }"
        :lnglat="homeMapStore.destinationLocation.coordinates"
      ></MapboxDefaultMarker>
      <MapboxDefaultMarker
        v-for="(location, index) in homeMapStore.carpoolLocations"
        :key="index"
        :marker-id="`location_${index}`"
        :options="{}"
        :lnglat="location.coordinates"
      >
      </MapboxDefaultMarker>
    </MapboxMap>
  </div>
</template>
>
