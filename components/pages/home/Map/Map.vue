<script setup lang="ts">
import mapboxgl, { Map } from "mapbox-gl";

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

const { mapInstance, markersGeoJSON, routesGeoJSON } =
  storeToRefs(homeMapStore);

onMounted(() => {
  const map = new mapboxgl.Map({
    container: mapInstance.value,
    style: "mapbox://styles/mapbox/streets-v12",
    center: [4.266714, 50.964028],
    zoom: 8,
    language: "nl",
  });

  map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

  mapInstance.value = map;

  map.on("load", () => {
    map.addSource("routes", {
      type: "geojson",
      data: routesGeoJSON.value,
    });
    map.addLayer({
      id: "routes",
      type: "line",
      source: "routes",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#008170",
        "line-width": 5,
        "line-opacity": 0.6,
      },
    });

    map.addSource("markers", {
      type: "geojson",
      data: markersGeoJSON.value,
    });
    map.addLayer({
      id: "markers",
      type: "circle",
      source: "markers",
      paint: {
        "circle-color": [
          "match",
          ["get", "type"],
          "destination",
          "#01584D",
          "carpool",
          "#6C6D74",
          "#ffffff",
        ],
        "circle-radius": 6,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
        "circle-opacity": 0.75,
      },
    });
  });

  // Create a popup, but don't add it to the map yet.
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  map.on("mouseenter", "markers", (e: mapboxgl.EventData) => {
    map.getCanvas().style.cursor = "pointer";

    const coordinates = e.features[0].geometry.coordinates.slice();
    const title = e.features[0].properties.title;
    const description = e.features[0].properties.description;

    popup
      .setLngLat(coordinates)
      .setHTML(
        `
          <h2>${title}</h2>
          <p>${description}</p>
        `,
      )
      .addTo(map);
  });

  map.on("mouseleave", "markers", () => {
    map.getCanvas().style.cursor = "";
    popup.remove();
  });
});
</script>

<template>
  <div class="map-wrapper">
    <div ref="mapInstance" class="map-container"></div>
  </div>
</template>

<style scoped lang="scss">
.map-wrapper {
  width: 100%;
  height: 100%;
}

.map-container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
