<script setup lang="ts">
import type { Location } from "~/types/Location";
const indexStore = useIndexStore();
const { isLoading } = storeToRefs(indexStore);

const homeFormStore = useHomeFormStore();
const { formValues, isEditing } = storeToRefs(homeFormStore);

const homeMapStore = useHomeMapStore();
const { carpoolLocations, destinationLocation, routes } =
  storeToRefs(homeMapStore);

const onRetrieveCarpoolLocation = (location: Location) => {
  isLoading.value = true;
  formValues.value = {
    ...formValues.value,
    ...location,
  };
  isLoading.value = false;
};

const onSubmit = async () => {
  if (!(formValues.value as Location).coordinates) {
    window.alert("Please enter an address");
    return;
  }
  isLoading.value = true;
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
  isLoading.value = false;
};

const cancelEdit = () => {
  isLoading.value = true;
  isEditing.value = null;
  homeFormStore.resetForm();
  isLoading.value = false;
};

const handleUpdate = async () => {
  isLoading.value = true;
  carpoolLocations.value = carpoolLocations.value.map((location) =>
    location.id === isEditing.value
      ? { ...location, ...formValues.value, id: isEditing.value }
      : location,
  );

  const newLocation = carpoolLocations.value.find(
    (location) => location.id === isEditing.value,
  );
  console.log(isEditing.value, newLocation, formValues.value, routes.value);

  // update route
  routes.value = routes.value.filter(
    (route) => route.carpoolId !== isEditing.value,
  );

  const newRoute = await homeMapStore.getRoute(
    { ...newLocation, ...formValues.value, id: isEditing.value } as Location,
    destinationLocation.value!,
  );
  routes.value.push(newRoute);

  isEditing.value = null;
  homeFormStore.resetForm();
  homeMapStore.updateMapData(["markers", "routes"]);
  isLoading.value = false;
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
        :model-value="formValues.name"
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
        :model-value="formValues.carSeats"
        @change="formValues.carSeats = parseInt($event.target.value)"
      />
    </div>
    <Button
      v-if="!isEditing"
      variant="accent"
      class="ml-auto"
      @click.prevent="onSubmit"
    >
      <Icon fill="var(--beige)" size="16px" name="plus"></Icon>
    </Button>
    <div v-else class="flex gap-2 ml-auto">
      <Button variant="accent">
        <Icon
          fill="var(--beige)"
          size="16px"
          name="cross"
          @click="cancelEdit"
        ></Icon>
      </Button>
      <Button variant="accent">
        <Icon
          fill="var(--beige)"
          size="16px"
          name="arrow-right"
          @click="handleUpdate"
        ></Icon>
      </Button>
    </div>
  </form>
</template>

<style>
.bottom-row {
  transition: 2s;
}
</style>
