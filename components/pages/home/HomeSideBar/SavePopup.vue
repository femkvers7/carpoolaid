<script setup lang="ts">
import * as yup from "yup";
import {
  createLocation,
  createLocations,
  updateLocation,
  getLocationsById,
} from "~/modules/api/locations";
import { createTrip, deleteTrip } from "~/modules/api/trips";
import { createGroup } from "~/modules/api/groups";

const emit = defineEmits(["close"]);

const homeMapStore = useHomeMapStore();
const { destinationLocation, carpoolLocations } = storeToRefs(homeMapStore);

const homeSuggestionsStore = useHomeSuggestionsStore();
const { suggestions } = storeToRefs(homeSuggestionsStore);

const warnings = ref<string[]>([]);

if (!suggestions.value.length) {
  warnings.value.unshift("Will be saved without carpool plan.");
}

// check if trip locations are already assigned to a trip
const { data: overlapData, error } = await getLocationsById([
  destinationLocation.value!.id,
  ...carpoolLocations.value.map((loc) => loc.id),
]);

if (overlapData && overlapData.length > 0) {
  warnings.value.unshift(
    `A trip with these locations already exists. <br/> Saving will overwrite the existing trip.`,
  );
}

const handleSave = async (values: { [key: string]: string }) => {
  if (!destinationLocation.value || !carpoolLocations.value.length) {
    throw createError({
      message: "Must select a destination and at least one carpool location",
    });
  }

  const user = useSupabaseUser();

  if (overlapData && overlapData.length > 0) {
    // delete existing trip
    await deleteTrip(overlapData[0].trip_id);
  }

  const { data: tripData, error: tripError } = await createTrip({
    userId: user.value!.id,
    name: values.tripName ?? "My trip",
  });

  if (tripError) {
    throw createError({
      ...tripError,
      message: "Error saving trip, please try again",
    });
  }

  const tripId = tripData![0].id;

  // save destination to trip
  const { data: destData, error: destError } = await createLocation({
    id: destinationLocation.value.id,
    lat: destinationLocation.value.coordinates[1],
    long: destinationLocation.value.coordinates[0],
    name: destinationLocation.value.place ?? null,
    type: "destination",
    full_address: destinationLocation.value.fullAddress ?? null,
    trip_id: tripId,
  });

  if (destError) {
    throw createError({
      ...destError,
      message: "Error saving destination, please try again",
    });
  }

  // save carpool locations to trip
  const locations = carpoolLocations.value.map((location) => ({
    id: location.id,
    lat: location.coordinates[1],
    long: location.coordinates[0],
    name: location.name ?? location.place ?? null,
    car_seats: location.carSeats,
    type: "carpool",
    full_address: location.fullAddress ?? null,
    trip_id: tripId,
  }));

  const { data: carpData, error: carpError } = await createLocations(locations);

  if (carpError) {
    throw createError({
      ...carpError,
      message: "Error saving carpool locations, please try again",
    });
  }

  if (suggestions.value.length > 0) {
    console.log("saving suggestions");
    // make groups
    for (const group of suggestions.value) {
      console.log(group, "group");
      const { data: groupData, error: groupError } = await createGroup({
        trip_id: tripId,
        id: group.id,
      });

      const groupId = groupData![0].id;
      await updateLocation(group.driver, {
        group_id: groupId,
        group_role: "driver",
      });

      for (const location of group.passengers) {
        await updateLocation(location, {
          group_id: groupId,
          group_role: "carpool",
        });
      }
    }
  }

  emit("close");
};
</script>
<template>
  <div class="backdrop">
    <Popup class="save-popup">
      <Icon
        fill="var(--purple)"
        size="16px"
        name="cross"
        class="absolute top-4 right-4 cursor-pointer"
        @click="$emit('close')"
      />
      <h3>Save your trip</h3>
      <Form
        :validation-schema="yup.object({ tripName: yup.string() })"
        @on-submit="handleSave"
      >
        <Input
          label="Trip name"
          name="tripName"
          type="text"
          width="20rem"
          class="save-popup__input"
        />
        <div
          v-for="(warning, index) in warnings"
          :key="index"
          class="warning my-4"
          v-html="warning"
        ></div>
        <Button class="ml-auto" type="submit">Save</Button>
      </Form>
    </Popup>
  </div>
</template>

<style>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 101;
}

.save-popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  padding: 1.5rem;
  width: fit-content;
  height: fit-content;

  text-align: center;

  .save-popup__input {
    margin: 1rem auto;
    text-align: start;
  }

  .warning {
    color: var(--red);
    font-size: 0.85rem;
    line-height: 1.2;
    text-align: start;
    font-style: italic;
  }
}
</style>
