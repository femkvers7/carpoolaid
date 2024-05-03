import { defineStore } from "pinia";
import type { Location } from "~/types/Location";
import type { Route } from "~/types/Route";
import mapboxgl, { GeoJSONSource } from "mapbox-gl";
import { v4 as uuidv4 } from "uuid";

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
              description: destinationLocation.value.label,
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
            description: location.label,
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
    carpool: Location,
    destination: Location,
  ): Promise<Route> => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${carpool.coordinates[0]},${carpool.coordinates[1]};${destination.coordinates[0]},${destination.coordinates[1]}?geometries=geojson&overview=full&access_token=${MAPBOX_API_KEY}`;
    const query = await fetch(url, {
      method: "GET",
    });
    const json = await query.json();

    const route = {
      id: uuidv4(),
      carpoolId: carpool.id,
      destinationId: destination.id,
      distance: json.routes[0].distance,
      duration: json.routes[0].duration,
      geometry: json.routes[0].geometry.coordinates,
    };

    return route;
  };

  const updateRoutes = async () => {
    routes.value = [];
    console.log(carpoolLocations.value, "carpoolLocations");

    carpoolLocations.value.forEach(async (location) => {
      const route = await getRoute(location, destinationLocation.value!);

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
