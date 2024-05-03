/**
 * method: POST
 * body: all of the routes
 *
 * return: a matrix of the amount of overlap per route
 *
 * To consider: can we exclude some routes or locations from the overlap calculation? If they have no chance of ever overlapping..
 */
import { Location } from "~/types/Location";
import type { Overlaps } from "~/types/Overlaps";
import { Route } from "~/types/Route";

const MAPBOX_API_KEY = useRuntimeConfig().public.mapboxAccessToken;

const calculateFirstCommonCoord = (
  geometry1: number[][],
  geometry2: number[][],
) => {
  const firstCommonCoord = geometry1.find((coord1) =>
    geometry2.some(
      (coord2) => coord1[0] === coord2[0] && coord1[1] === coord2[1],
    ),
  );

  return firstCommonCoord;
};

const calculateOverlap = async (
  geometry1: number[][],
  geometry2: number[][],
  destination: number[],
) => {
  const firstCommonCoord = calculateFirstCommonCoord(geometry1, geometry2);

  if (!firstCommonCoord) {
    return Infinity;
  }
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${firstCommonCoord[0]},${firstCommonCoord[1]};${destination[0]},${destination[1]}?overview=false&access_token=${MAPBOX_API_KEY}`;
  const query = await fetch(url, {
    method: "GET",
  });
  const result = await query.json();

  return result.routes[0].distance;
};

const calculateOverlapMatrix = async (
  routes: Route[],
  destination: Location,
) => {
  const overlaps: Overlaps = {};

  for (const route of routes) {
    for (const otherRoute of routes) {
      if (route.id !== otherRoute.id) {
        const overlap = await calculateOverlap(
          route.geometry,
          otherRoute.geometry,
          destination.coordinates,
        );
        overlaps[route.id] = overlaps[route.id] || {};
        overlaps[route.id][otherRoute.id] = overlap;
      } else {
        overlaps[route.id] = overlaps[route.id] || {};
        overlaps[route.id][otherRoute.id] = 0;
      }
    }
  }

  return overlaps;
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const destination = body.destination;
  const routes = body.routes;

  const overlaps = await calculateOverlapMatrix(routes, destination);

  return overlaps;
});
