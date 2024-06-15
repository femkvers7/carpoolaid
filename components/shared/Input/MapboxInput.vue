<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import type { Location } from "~/types/Location";

useHead({
  script: [
    {
      src: "https://api.mapbox.com/search-js/v1.0.0-beta.19/web.js",
      id: "search-js",
      defer: "",
    },
  ],
  link: [
    {
      rel: "stylesheet",
      href: "https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css",
    },
  ],
});

const MAPBOX_API_KEY = useRuntimeConfig().public.MAPBOX_ACCESS_TOKEN;

defineProps<{
  id?: string;
  name?: string;
  initialValue?: string;
}>();

const emit = defineEmits(["retrieve"]);

const onRetrieve = (event: any) => {
  const locationFeatures = event.detail.features[0];

  const location: Location = {
    id: uuidv4(),
    coordinates: locationFeatures.geometry.coordinates as number[],
    place: locationFeatures.properties.context.place?.name ?? "",
    fullAddress: locationFeatures.properties.full_address ?? "",
  };

  emit("retrieve", location);
};
</script>

<template>
  <mapbox-search-box
    :id="id"
    :name="name"
    class="w-full"
    placeholder=" "
    :access-token="MAPBOX_API_KEY"
    :language="['nl']"
    :proximity="[3.866714, 50.964028]"
    :types="[
      'poi',
      'city',
      'street',
      'address',
      'postcode',
      'place',
      'locality',
      'neighborhood',
    ]"
    @retrieve="onRetrieve"
    @input.prevent
  >
  </mapbox-search-box>
</template>

<style>
mapbox-search-box {
  :focus-visible {
    outline: none;
  }
  div {
    background-color: var(--beige) !important;
    box-shadow: none !important;
    border-radius: 0.5rem !important;
    color: var(--purple) !important;
    font-family: Montserrat, sans-serif !important;
  }
}
</style>
