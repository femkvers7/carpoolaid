/**
 * method: POST
 * body: all of the routes + destination
 *
 * return: array of SuggestionGroup objects
 *
 * To consider: can we exclude some routes or locations from the overlap calculation? If they have no chance of ever overlapping..
 */
import { Location } from "~/types/Location";
import type { Overlaps } from "~/types/Overlaps";
import { Route } from "~/types/Route";
import { SuggestionGroup } from "~/types/Suggestion";
import { v4 as uuidv4 } from "uuid";

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
  route1: Route,
  route2: Route,
  destination: number[],
) => {
  const firstCommonCoord = calculateFirstCommonCoord(
    route1.geometry,
    route2.geometry,
  );

  if (!firstCommonCoord) {
    return {
      overlap: 0,
    };
  }
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${firstCommonCoord[0]},${firstCommonCoord[1]};${destination[0]},${destination[1]}?overview=false&access_token=${MAPBOX_API_KEY}`;
  const query = await fetch(url, {
    method: "GET",
  });
  const result = await query.json();

  return {
    overlap: result.routes[0].distance,
    distance1: route1.distance - result.routes[0].distance,
    distance2: route2.distance - result.routes[0].distance,
  };
};

const calculateOverlapMatrix = async (
  routes: Route[],
  destination: Location,
) => {
  const overlaps: Overlaps = {};

  for (const route1 of routes) {
    for (const route2 of routes) {
      if (route1.id !== route2.id) {
        const overlap = await calculateOverlap(
          route1,
          route2,
          destination.coordinates,
        );

        /**
         * Two conditions:
         * 1. The overlap is more than 20km
         * 2. If the person has no car, they shouldn't travel farther than 10km
         */
        if (
          overlap.overlap > 15000 &&
          (route1.carSeats ||
            (!route1.carSeats && overlap.distance1! < 10000)) &&
          (route2.carSeats || (!route2.carSeats && overlap.distance2! < 10000))
        ) {
          overlaps[route1.carpoolId] = overlaps[route1.carpoolId] || {};
          overlaps[route1.carpoolId][route2.carpoolId] = overlap.overlap; // instead of just keeping track of the overlap value, we can add more information here, e.g. the distance to the meeting point for both routes
        }
      }
    }
  }

  return overlaps;
};

const calculateMaxOverlap = (overlaps: Overlaps) => {
  let max = {
    value: Number.MIN_VALUE,
    carpoolId1: "",
    carpoolId2: "",
  };

  for (const carpoolId1 in overlaps) {
    for (const carpoolId2 in overlaps[carpoolId1]) {
      if (overlaps[carpoolId1][carpoolId2] > max.value) {
        max = {
          value: overlaps[carpoolId1][carpoolId2],
          carpoolId1,
          carpoolId2,
        };
      }
    }
  }

  return max;
};

const calculateGroups = (overlaps: Overlaps, routes: Route[]) => {
  // make a copy of carpoolIds to keep track who has (not) been assigned
  const carpoolIds = routes.map((route) => route.carpoolId);
  const groups: SuggestionGroup[] = [];

  while (overlaps && Object.keys(overlaps).length > 0) {
    const maxOverlap = calculateMaxOverlap(overlaps);

    // this should never occur, but just in cas
    if (maxOverlap.value < 15000) break;

    /*** Variables ***/
    const route1 = routes.find(
      (route) => route.carpoolId === maxOverlap.carpoolId1,
    );
    const route2 = routes.find(
      (route) => route.carpoolId === maxOverlap.carpoolId2,
    );

    const existingGroup = groups.find(
      (group) =>
        group.driver === maxOverlap.carpoolId2 ||
        group.passengers.includes(maxOverlap.carpoolId2),
    );

    if (existingGroup) {
      if (existingGroup.passengers.length < existingGroup.capacity - 1) {
        existingGroup.passengers.push(maxOverlap.carpoolId1);

        delete overlaps[maxOverlap.carpoolId1];
        delete carpoolIds[carpoolIds.indexOf(maxOverlap.carpoolId1)];
      } else {
        if (route1?.carSeats) {
          groups.push({
            id: uuidv4(),
            driver: route1.carpoolId,
            passengers: [],
            capacity: route1.carSeats,
          });

          delete overlaps[maxOverlap.carpoolId1];
          delete carpoolIds[carpoolIds.indexOf(maxOverlap.carpoolId1)];
        } else {
          // switch with someone from existing group
          const switchWithID = existingGroup.passengers.find((passenger) => {
            const passengerRoute = routes.find(
              (route) => route.carpoolId === passenger,
            );
            return passengerRoute!.carSeats && passengerRoute!.carSeats > 0;
          });

          const switchWith = routes.find(
            (route) => route.carpoolId === switchWithID,
          );

          if (!switchWith) {
            // if there is no one to switch with, we cannot provide a better solution
            // the user will be part of the people 'driving alone'
            // manual intervention is needed
            delete overlaps[maxOverlap.carpoolId1];
          } else {
            // remove the switcher from existing group
            existingGroup.passengers = existingGroup.passengers.filter(
              (passenger) => passenger !== switchWith.carpoolId,
            );
            // add person to existing group
            existingGroup.passengers.push(route1!.carpoolId);
            // start a new group with the switcher
            groups.push({
              id: uuidv4(),
              driver: switchWith.carpoolId,
              passengers: [],
              capacity: switchWith.carSeats,
            });

            delete overlaps[maxOverlap.carpoolId1];
            delete carpoolIds[carpoolIds.indexOf(maxOverlap.carpoolId1)];
          }
        }

        // if car is full, delete it as an option from all overlaps
        // only doing this now, allows the driver to be switched if needed
        if (existingGroup.passengers.length === existingGroup.capacity - 1) {
          for (const carpool in overlaps) {
            delete overlaps[carpool][existingGroup.driver];
            for (const assignedRoute of existingGroup.passengers) {
              delete overlaps[carpool][assignedRoute];
            }
          }
        }
      }
    } else {
      // determine who is the driver & start a new group
      const potentialDrivers = [route1, route2].filter(
        (person) => person?.carSeats,
      );

      // improvement possible!
      // if the assigned driver does not have a car, we should switch them with another group, if possible
      // --> need to trace back an alternative group they can belong to

      if (potentialDrivers.length === 0) {
        delete overlaps[maxOverlap.carpoolId1];
        delete overlaps[maxOverlap.carpoolId2];
      } else if (potentialDrivers.length === 1) {
        const driver = potentialDrivers[0];
        const passenger = driver === route1 ? route2 : route1;

        groups.push({
          id: uuidv4(),
          driver: driver!.carpoolId,
          passengers: [passenger!.carpoolId],
          capacity: driver!.carSeats,
        });
        delete overlaps[maxOverlap.carpoolId1];
        delete overlaps[maxOverlap.carpoolId2];
        delete carpoolIds[carpoolIds.indexOf(maxOverlap.carpoolId1)];
        delete carpoolIds[carpoolIds.indexOf(maxOverlap.carpoolId2)];
      } else {
        // determine driver

        const driver = route1!.distance < route2!.distance ? route2 : route1;
        const passenger = driver === route1 ? route2 : route1;

        groups.push({
          id: uuidv4(),
          driver: driver!.carpoolId,
          passengers: [passenger!.carpoolId],
          capacity: driver!.carSeats,
        });

        delete overlaps[maxOverlap.carpoolId1];
        delete overlaps[maxOverlap.carpoolId2];
        delete carpoolIds[carpoolIds.indexOf(maxOverlap.carpoolId1)];
        delete carpoolIds[carpoolIds.indexOf(maxOverlap.carpoolId2)];
      }
    }
  }

  for (const carpool in carpoolIds) {
    groups.push({
      id: uuidv4(),
      driver: carpoolIds[carpool],
      passengers: [],
      capacity: routes.find((route) => route.carpoolId === carpoolIds[carpool])!
        .carSeats,
    });
  }
  return groups;
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const destination = body.destination;
  const routes: Route[] = body.routes;

  const overlaps = await calculateOverlapMatrix(routes, destination);

  const groups = calculateGroups(overlaps, routes);

  console.log(groups, "groups");

  return groups; // carpool location ids
});
