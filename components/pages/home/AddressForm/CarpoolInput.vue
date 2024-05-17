<script setup lang="ts">
import type { Location } from "~/types/Location";
const homeFormStore = useHomeFormStore();
const { formValues, isEditing } = storeToRefs(homeFormStore);

const homeMapStore = useHomeMapStore();
const { carpoolLocations, destinationLocation, routes } =
  storeToRefs(homeMapStore);

const onRetrieveCarpoolLocation = (location: Location) => {
  formValues.value = { ...formValues.value, ...location };
};

const onSubmit = async () => {
  if (!(formValues.value as Location).coordinates) {
    window.alert("Please enter an address");
    return;
  }

  carpoolLocations.value.push(formValues.value as Location);

  // computeRoute
  const route = await homeMapStore.getRoute(
    formValues.value as Location,
    destinationLocation.value!,
  );

  routes.value.push(route);
  homeMapStore.updateMapData(["markers", "routes"]);

  // set form back to reset
  homeFormStore.resetForm();
};
</script>

<template>
  <form method="post" class="flex flex-col gap-2 w-full" @submit.prevent>
    <div class="flex flex-col gap-1">
      <label class="subtle" for="location"> Address </label>
      <MapboxInput
        id="location-input"
        name="location"
        @retrieve="onRetrieveCarpoolLocation"
      />
    </div>
    <div class="flex gap-1 items-start bottom-row">
      <Input
        id="name-input"
        label="Name"
        name="name"
        class="w-full"
        placeholder="Optional"
        :value="formValues.name ?? ''"
        required
        @change="formValues.name = $event.target.value"
      />
      <Toggle
        label="Car"
        :value="!!formValues.carSeats"
        @change="(checked) => (formValues.carSeats = checked ? 4 : 0)"
      />
      <Input
        id="car-seats-input"
        type="number"
        label="Seats"
        name="car-seats"
        width="15%"
        :min="0"
        :value="formValues.carSeats"
        @change="formValues.carSeats = parseInt($event.target.value)"
      />
    </div>
    <Button variant="accent" class="ml-auto" @click.prevent="onSubmit">
      <Icon fill="var(--beige)" size="16px" name="plus"></Icon>
    </Button>
  </form>
</template>

<style>
.bottom-row {
  transition: 2s;
}
</style>
