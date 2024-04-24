import { defineStore } from "pinia";
import type { Location } from "~/types/Location";
import type { Route } from "~/types/Route";
import mapboxgl from "mapbox-gl";

export const useHomeMapStore = defineStore("homeMap", () => {
  const destinationLocation = ref<Location | null>(null);
  const carpoolLocations = ref<Location[]>([]);
  const routes = ref<Route[]>([]);
  const mapInstance = ref<mapboxgl.Map | null>(null);

  const MAPBOX_API_KEY = useRuntimeConfig().public.mapboxAccessToken;

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

  const getRoute = async (
    carpoolCoords: number[],
    destinationCoords: number[],
  ) => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${carpoolCoords[0]},${carpoolCoords[1]};${destinationCoords[0]},${destinationCoords[1]}?geometries=geojson&access_token=${MAPBOX_API_KEY}`;
    const query = await fetch(url, {
      method: "GET",
    });
    const json = await query.json();
    const route = {
      geometry: json.routes[0].geometry.coordinates,
      carpoolCoords: carpoolCoords,
      destinationCoords: destinationCoords,
    };

    console.log(route);

    return route;
  };

  return {
    destinationLocation,
    carpoolLocations,
    routes,
    mapInstance,
    markersGeoJSON,
    routesGeoJSON,
    getRoute,
  };
});
