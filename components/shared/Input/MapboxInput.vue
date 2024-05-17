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
});

const MAPBOX_API_KEY = useRuntimeConfig().public.mapboxAccessToken;

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
    address: {
      country: locationFeatures.properties.context.country?.name ?? "Belgium",
      place: locationFeatures.properties.context.place?.name ?? "",
      street: locationFeatures.properties.context.street?.name ?? "",
      address_number:
        locationFeatures.properties.context.address?.address_number ?? "",
    },
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
    :types="[
      'city',
      'street',
      'address',
      'postcode',
      'place',
      'locality',
      'neighborhood',
    ]"
    :theme="{
      variables: {
        colorBackground: 'var(--beige)',
        boxShadow: 'none',
        borderRadius: '0.5rem',
        colorText: 'var(--purple)',
        fontFamily: 'Montserrat, sans-serif',
      },
    }"
    @retrieve="onRetrieve"
    @input.prevent
  >
  </mapbox-search-box>
  <!--  :value="initialAddress" -> crashes app bc search field doesn't exist on launch, somehow 
    problemen voor later
  -->
</template>
