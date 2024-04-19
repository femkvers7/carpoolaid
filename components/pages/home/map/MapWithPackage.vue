<!-- Map using nuxt-mapbox
  - slow once routes/layers are added
  - not in line with most available documentation
  - limits possibilities

-> move to the 'traditional' method

!! same problem !!
-->
<script setup lang="ts">
import { useHomeMapStore } from "~/stores/maps/home";

const homeMapStore = useHomeMapStore();
const { routes, destinationLocation, carpoolLocations } =
  storeToRefs(homeMapStore);
</script>

<template>
  <div class="map-container">
    <MapboxMap
      map-id="map_home"
      :options="{
        center: [4.266714, 50.964028],
        zoom: 8,
      }"
    >
      <MapboxDefaultMarker
        v-if="destinationLocation && destinationLocation"
        :marker-id="`location_destination`"
        :options="{
          color: 'red',
        }"
        :lnglat="destinationLocation.coordinates"
      >
        <MapboxDefaultPopup
          popup-id="popup_destination"
          :lnglat="destinationLocation.coordinates"
          :close-on-click="true"
          :close-on-move="true"
        >
          <div>
            <h2>Destination</h2>
            <p>{{ destinationLocation.full_address }}</p>
          </div>
        </MapboxDefaultPopup>
      </MapboxDefaultMarker>
      <MapboxDefaultMarker
        v-for="(location, index) in carpoolLocations"
        :key="index"
        :marker-id="`location_${index}`"
        :options="{}"
        :lnglat="location.coordinates"
      >
        <MapboxDefaultPopup
          :popup-id="`popup_${index}`"
          :lnglat="location.coordinates"
          :close-on-click="true"
          :close-on-move="true"
        >
          <div>
            <h2>Carpool Location</h2>
            <p>{{ location.full_address }}</p>
          </div>
        </MapboxDefaultPopup>
      </MapboxDefaultMarker>
      <MapboxSource
        v-if="routes.length"
        :source-id="`routes`"
        :source="{
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: routes,
          },
        }"
      />
      <MapboxLayer
        v-if="routes.length"
        :layer="{
          type: 'line',
          source: `routes`,
          id: `routes`,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#4887be',
            'line-width': 3,
            'line-opacity': 0.75,
          },
        }"
      />
    </MapboxMap>
  </div>
</template>
