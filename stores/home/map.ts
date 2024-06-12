import { defineStore } from "pinia";
import type { Location } from "~/types/Location";
import type { Route } from "~/types/Route";
import mapboxgl, {
  GeoJSONSource,
  type LngLatBoundsLike,
  type LngLatLike,
} from "mapbox-gl";
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
  const popups = ref<mapboxgl.Popup | null>(null);

  const setPopup = (coord: LngLatLike, html: string) => {
    popups.value = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    })
      .setLngLat(coord)
      .setHTML(html);
  };

  const removePopup = () => {
    const popup = document.getElementsByClassName("mapboxgl-popup");
    if (popup.length) {
      popup[0].remove();
    }
  };

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
              id: destinationLocation.value.id,
              title: destinationLocation.value.place,
              description: "Destination",
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
            id: location.id,
            title: location.place,
            description: location.name ?? "",
            type: "carpool",
            carSeats: location.carSeats,
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
      carSeats: carpool.carSeats ?? 4,
      destinationId: destination.id,
      distance: json.routes[0].distance,
      duration: json.routes[0].duration,
      geometry: json.routes[0].geometry.coordinates,
    };

    return route;
  };

  const updateRoutes = async () => {
    routes.value = [];
    for (const location of carpoolLocations.value) {
      const route = await getRoute(location, destinationLocation.value!);
      routes.value.push(route);
    }
  };

  // these can (normally) be used to snap map to fit all markers
  // but rn this functionality is breaking the application
  const bounds = computed(() => {
    if (carpoolLocations.value.length > 1) {
      const lngList = carpoolLocations.value.map((location) => {
        return location.coordinates[0];
      });

      const latList = carpoolLocations.value.map((location) => {
        return location.coordinates[1];
      });

      const bounds: mapboxgl.LngLatBoundsLike = [
        [Math.min(...lngList), Math.min(...latList)],
        [Math.max(...lngList), Math.max(...latList)],
      ];

      return bounds;
    } else {
      return [
        [2.567815, 50.474184],
        [6.122369, 51.553027],
      ] as mapboxgl.LngLatBoundsLike;
    }
  });

  const testFunction = () => {
    // fitBounds is breaking the page!!!
    const bbox: LngLatBoundsLike = [
      [-79, 43],
      [-73, 45],
    ];
    mapInstance.value!.fitBounds(bbox, {
      padding: { top: 10, bottom: 25, left: 15, right: 5 },
    });
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

  const reset = () => {
    destinationLocation.value = null;
    carpoolLocations.value = [];
    routes.value = [];
    if (mapInstance.value) {
      updateMapData(["markers", "routes"]);
    }
  };

  return {
    destinationLocation,
    carpoolLocations,
    routes,
    mapInstance,
    markersGeoJSON,
    routesGeoJSON,
    popups,
    getRoute,
    updateRoutes,
    updateMapData,
    testFunction,
    reset,
    setPopup,
    removePopup,
  };
});
