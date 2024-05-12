<script setup lang="ts">
import type { Location } from "~/types/Location";
import { v4 as uuidv4 } from "uuid";

const MAPBOX_API_KEY = useRuntimeConfig().public.mapboxAccessToken;

useHead({
  script: [
    {
      src: "https://api.mapbox.com/search-js/v1.0.0-beta.19/web.js",
      id: "search-js",
      defer: "",
    },
  ],
});

const props = defineProps<{
  state: "initial" | "edit" | "loading" | "success" | "error";
  initialValues?: Location;
}>();

const formValues = ref<{
  label?: string;
  location?: Location;
  carAvailable?: boolean;
  carSeats?: number;
}>({
  location: undefined,
  carAvailable: true,
  carSeats: 4,
});

if (props.initialValues) {
  const { label, carAvailable, carSeats, ...location } = props.initialValues;
  formValues.value = {
    label,
    carAvailable: carAvailable,
    carSeats,
    location,
  };
}

const initialAddress = computed(() => {
  if (props.initialValues) {
    return `${props.initialValues.address?.street} ${props.initialValues.address?.address_number} ${props.initialValues.address?.place} ${props.initialValues.address?.country}`;
  }

  return "";
});

const onRetrieveDestinationLocation = (event: any) => {
  console.log(event, "location");
  const locationFeatures = event.detail.features[0];

  const location: Location = {
    id: uuidv4(),
    coordinates: locationFeatures.geometry.coordinates as number[],
    address: {
      country: locationFeatures.properties.context.country?.name ?? "Belgium",
      place: locationFeatures.properties.context.place?.name ?? "",
      street: locationFeatures.properties.context.street?.name ?? "",
      address_number:
        locationFeatures.properties.context.address?.address_number ?? "",
    },
  };

  formValues.value!.location = location;
};

const onSubmit = () => {
  if (!formValues.value.location) {
    window.alert("Please enter an address");
    return;
  }

  if (!formValues.value.carAvailable) {
    formValues.value.carSeats = 0;
  }

  const { location, ...rest } = formValues.value;
  const newLocation = { ...location, ...rest };
  console.log(newLocation, "newLocation");
};
</script>

<template>
  <form method="post" class="flex gap-4 w-full items-end">
    <div class="flex flex-col w-3/12">
      <label for="label">Name</label>
      <input v-model="formValues.label" type="text" name="label" />
    </div>
    <div class="flex flex-col w-6/12">
      <label for="location">Address</label>
      <mapbox-search-box
        id="location"
        v-model="formValues.location"
        name="location"
        :access-token="MAPBOX_API_KEY"
        :language="['nl']"
        :types="[
          'city',
          'street',
          'address',
          'postcode',
          'place',
          'locality',
          'neighborhood',
        ]"
        @retrieve="onRetrieveDestinationLocation"
      >
      </mapbox-search-box>
    </div>
    <div class="flex gap-2 w-2/12">
      <input
        v-model="formValues.carAvailable"
        type="checkbox"
        name="carAvailable"
      />
      <label for="carAvailable">Car available?</label>
    </div>
    <div v-if="formValues.carAvailable" class="flex flex-col w-1/12">
      <label for="carSeats">#seats</label>
      <input v-model="formValues.carSeats" type="number" name="carSeats" />
    </div>
    <button @click.prevent="onSubmit">
      <Icon fill="black" size="16px" name="arrow-right"></Icon>
    </button>
  </form>
</template>

<style scoped>
input {
  padding: 0.3rem 0.5rem;
  border: 1px solid var(--neutral-900);
  border-radius: 0.25rem;
  background-color: var(--white);
}
</style>
