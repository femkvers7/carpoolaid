import { defineStore } from "pinia";
import type { Location } from "~/types/Location";
import type { Route } from "~/types/Route";
import mapboxgl, { GeoJSONSource } from "mapbox-gl";

export const useHomeMapStore = defineStore("homeMap", () => {
  const emptyFeatureCollection: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: [],
  };

  const destinationLocation = ref<Location | null>(null);
  const carpoolLocations = ref<Location[]>([]);
  const routes = ref<Route[]>([]);
  const mapInstance = ref<mapboxgl.Map | null>(null);

  const MAPBOX_API_KEY = useRuntimeConfig().public.mapboxAccessToken;

  const markersGeoJSON = computed((): GeoJSON.FeatureCollection => {
    if (!(carpoolLocations.value.length || destinationLocation.value))
      return emptyFeatureCollection;

    const destinationFeature: GeoJSON.Feature[] = destinationLocation.value
      ? [
          {
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
          },
        ]
      : [];

    const carpoolFeatures: GeoJSON.Feature[] = carpoolLocations.value.length
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
      features: [...destinationFeature, ...carpoolFeatures],
    };
  });

  const routesGeoJSON = computed((): GeoJSON.FeatureCollection => {
    if (!destinationLocation.value || !routes.value.length) {
      return emptyFeatureCollection;
    }
    return {
      type: "FeatureCollection",
      features: routes.value.map((route) => ({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: route.geometry,
        },
        properties: {},
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

    return route;
  };

  const updateRoutes = async () => {
    routes.value = [];

    carpoolLocations.value.forEach(async (location) => {
      const route = await getRoute(
        location.coordinates,
        destinationLocation.value!.coordinates,
      );

      routes.value.push(route);
    });
    console.log(routes.value, "routes");
  };

  const updateMapData = (types: string[]) => {
    if (types.includes("markers")) {
      (mapInstance.value!.getSource("markers") as GeoJSONSource).setData(
        markersGeoJSON.value,
      );
    }
    if (types.includes("routes")) {
      (mapInstance.value!.getSource("routes") as GeoJSONSource).setData(
        routesGeoJSON.value,
      );
    }
  };

  return {
    destinationLocation,
    carpoolLocations,
    routes,
    mapInstance,
    markersGeoJSON,
    routesGeoJSON,
    getRoute,
    updateRoutes,
    updateMapData,
  };
});
