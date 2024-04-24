import { defineStore } from "pinia";
import type { Location } from "~/types/Location";
import type { Route } from "~/types/Route";
import mapboxgl from "mapbox-gl";

export const useHomeMapStore = defineStore("homeMap", () => {
  const destinationLocation = ref<Location | null>(null);
  const carpoolLocations = ref<Location[]>([]);
  const routes = ref<Route[]>([]);
  const markers = ref<mapboxgl.Marker[]>([]);

  const mapInstance = ref<mapboxgl.Map | null>(null);

  const markersGeoJSON = computed(() => {
    if (!(carpoolLocations.value.length || destinationLocation.value))
      return null;

    const destinationFeature = destinationLocation.value
      ? {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: destinationLocation.value.coordinates,
          },
          properties: {
            title: "Destination",
            description: destinationLocation.value.full_address,
            type: "destination",
          },
        }
      : null;

    const carpoolFeatures = carpoolLocations.value.length
      ? carpoolLocations.value.map((location) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: location.coordinates,
          },
          properties: {
            title: "Carpool",
            description: location.full_address,
            type: "carpool",
          },
        }))
      : [];

    return {
      type: "FeatureCollection",
      features: [destinationFeature, ...carpoolFeatures],
    };
  });

  const routesGeoJSON = computed(() => {
    if (!destinationLocation.value || !routes.value.length) {
      return {
        type: "FeatureCollection",
        features: [],
      };
    }
    return {
      type: "FeatureCollection",
      features: routes.value.map((route) => ({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: route.geometry,
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
    markersGeoJSON,
    routesGeoJSON,
  };
});
