import { defineStore } from "pinia";
import type { Location } from "~/types/Location";
import type { GeoJson } from "~/types/Routes";
import mapboxgl from "mapbox-gl";

export const useHomeMapStore = defineStore("homeMap", () => {
  const destinationLocation = ref<Location | null>(null);
  const carpoolLocations = ref<Location[]>([]);
  const routes = ref<GeoJson[]>([]);
  const markers = ref<mapboxgl.Marker[]>([]);

  const mapInstance = ref<mapboxgl.Map | null>(null);

  const destinationGeoJSON = computed(() => {
    if (!destinationLocation.value) return null;
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: destinationLocation.value.coordinates,
      },
    };
  });

  const carpoolGeoJSON = computed(() => {
    if (!carpoolLocations.value.length) return null;
    return {
      type: "FeatureCollection",
      features: carpoolLocations.value.map((location) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: location.coordinates,
        },
      })),
    };
  });

  const routeGeoJSON = computed(() => {
    if (!routes.value.length) return null;
    return {
      type: "FeatureCollection",
      features: routes.value.map((route) => ({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: route,
        },
      })),
    };
  });

  return {
    destinationLocation,
    carpoolLocations,
    routes,
    markers,
    mapInstance,
    destinationGeoJSON,
    carpoolGeoJSON,
    routeGeoJSON,
  };
});
