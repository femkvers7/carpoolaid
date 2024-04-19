<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import { useHomeMapStore } from "~/stores/maps/home";

useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css",
    },
  ],
});

const MAPBOX_API_KEY = useRuntimeConfig().public.mapboxAccessToken;
const homeMapStore = useHomeMapStore();

mapboxgl.accessToken = MAPBOX_API_KEY;

const { mapInstance, destinationGeoJSON, carpoolGeoJSON, routeGeoJSON } =
  storeToRefs(homeMapStore);

onMounted(() => {
  const map = new mapboxgl.Map({
    container: mapInstance.value,
    style: "mapbox://styles/mapbox/streets-v11",
    center: [4.266714, 50.964028],
    zoom: 8,
  });

  mapInstance.value = map;

  map.on("load", () => {
    map.addSource("destination", {
      type: "geojson",
      data: destinationGeoJSON.value,
    });
    map.addLayer({
      id: "destination",
      type: "symbol",
      source: "destination",
      layout: {
        "icon-image": "marker-15",
        "icon-size": 3,
        "icon-allow-overlap": true,
      },
    });

    map.addSource("carpool", {
      type: "geojson",
      data: carpoolGeoJSON.value,
    });
    map.addLayer({
      id: "carpool",
      type: "symbol",
      source: "carpool",
      layout: {
        "icon-image": "marker-15",
        "icon-size": 2,
        "icon-allow-overlap": true,
      },
    });

    map.addSource("route", {
      type: "geojson",
      data: routeGeoJSON.value,
    });
    map.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#888",
        "line-width": 8,
      },
    });
  });
});
</script>

<template>
  <div class="map-wrapper">
    <div ref="mapInstance" class="map-container"></div>
  </div>
</template>

<style>
.map-container {
  width: 100%;
  height: 30rem;
}
</style>
