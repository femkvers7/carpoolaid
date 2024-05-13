<script setup lang="ts">
import mapboxgl from "mapbox-gl";

useHead({
  script: [
    {
      src: "https://api.mapbox.com/search-js/v1.0.0-beta.21/web.js",
      id: "search-js",
      defer: "",
    },
  ],
});

const MAPBOX_API_KEY = useRuntimeConfig().public.mapboxAccessToken;
mapboxgl.accessToken = MAPBOX_API_KEY;
</script>

<template>
  <Popup
    height="calc(100vh - 2rem - 6.5rem)"
    width="400px"
    class="flex flex-col content-center justify-start"
  >
    <div class="manual-input">
      <div class="destination">
        <div class="destination__title">
          <Icon fill="var(--purple)" size="16px" width="12px" name="pin" />
          <p>Choose a destination</p>
        </div>
        <mapbox-search-box
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
        >
        </mapbox-search-box>
        <!-- <Input name="address" />-->
      </div>
      <div class="carpool">
        <div class="carpool__title">
          <Icon fill="var(--purple)" size="16px" name="car" />
          <p>Choose your carpool locations</p>
        </div>
        <mapbox-address-autofill>
          <Input label="Address" name="address" />
        </mapbox-address-autofill>
        <div class="flex gap-2 items-end">
          <Input label="Name" name="name" />
          <Toggle label="Car" />
          <Input label="Seats" name="car-seats" type="number" width="15%" />
        </div>
      </div>
    </div>
    <span class="m-auto italic">or</span>
    <div class="upload-csv flex flex-col items-center">
      <Icon fill="var(--lavender)" size="48px" name="upload" />
      <Button variant="tertiary">Upload CSV</Button>
    </div>
    <Button variant="primary" class="m-auto"> Generate suggestions</Button>
  </Popup>
</template>

<style lang="scss" scoped>
.carpool,
.destination {
  margin-bottom: 2rem;
}

.destination__title,
.carpool__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
