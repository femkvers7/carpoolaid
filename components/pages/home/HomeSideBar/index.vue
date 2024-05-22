<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import Papa from "papaparse";

const homeMapStore = useHomeMapStore();
const { destinationLocation, carpoolLocations } = storeToRefs(homeMapStore);

const homeCsvStore = useHomeCsvStore();

const MAPBOX_API_KEY = useRuntimeConfig().public.mapboxAccessToken;
mapboxgl.accessToken = MAPBOX_API_KEY;

// check if logged in
const jwt = useCookie("sb-access-token");
const isLoggedIn = computed(() => !!jwt.value);

const handleFileUpload = (event: Event) => {
  const uploadedFile = (event.target as HTMLInputElement).files?.[0] || null;

  console.log("file upload", uploadedFile);

  if (!uploadedFile) {
    return;
  }

  Papa.parse(uploadedFile, {
    header: true,
    skipEmptyLines: true,
    complete: (results: any) => {
      // what to do after parsing file?
      console.log(results);

      homeCsvStore.$patch({
        headers: results.meta.fields,
        rows: results.data,
        showColumnPopup: true,
      });
    },
  });
};

const handleReset = () => {
  homeMapStore.reset();
  homeCsvStore.reset();
};
</script>

<template>
  <Popup
    height="calc(100vh - 2rem - 5.5rem)"
    width="400px"
    class="flex flex-col content-center justify-start overflow-y-auto"
  >
    <div class="flex justify-between items-center mb-4">
      <p class="text-lg">Your trip</p>
      <div class="flex gap-3">
        <Tooltip content="Reset" position="left">
          <Button variant="neutral" @click="handleReset">
            <Icon fill="var(--purple)" size="16px" name="reset" />
          </Button>
        </Tooltip>
        <Tooltip
          :content="isLoggedIn ? 'Save' : 'Log in to save trip'"
          position="left"
        >
          <Button :variant="isLoggedIn ? 'neutral' : 'disabled'">
            <Icon fill="var(--purple)" size="16px" name="floppy" />
          </Button>
        </Tooltip>
      </div>
    </div>
    <div class="manual-input">
      <div class="destination">
        <div class="destination__title">
          <Icon fill="var(--purple)" size="16px" width="12px" name="pin" />
          <p>Choose a destination</p>
        </div>
        <DestinationInput />
      </div>
      <div class="carpool">
        <div class="carpool__title">
          <Icon fill="var(--purple)" size="16px" name="car" />
          <p>Choose your carpool locations</p>
        </div>
        <div v-if="destinationLocation">
          <CarpoolInput />
          <div class="mt-4 carpool-list">
            <CarpoolAddress
              v-for="location in carpoolLocations"
              :key="location.id"
              :location="location"
            />
          </div>
        </div>
        <span v-else class="subtle italic">
          Please select a destination to continue
        </span>
      </div>
    </div>
    <span
      v-show="destinationLocation && !carpoolLocations.length"
      class="m-auto italic"
      >or</span
    >
    <div v-show="destinationLocation && !carpoolLocations.length">
      <label class="flex flex-col items-center cursor-pointer">
        <input
          type="file"
          accept=".csv"
          name="upload_csv"
          class="hidden"
          @click="$event.target.value = ''"
          @change="handleFileUpload"
        />
        <Icon fill="var(--lavender)" size="48px" name="upload" />
        <div variant="tertiary" class="upload_csv__button-text">Upload CSV</div>
      </label>
    </div>
    <Button
      v-show="destinationLocation && carpoolLocations?.length > 1"
      variant="primary"
      class="mx-auto mt-auto mb-3"
    >
      Generate Carpoolplan
    </Button>
  </Popup>
</template>

<style lang="scss" scoped>
.destination__title,
.carpool__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0rem;
}

.carpool-list {
  padding-right: 0.5rem;
  max-height: calc(100vh - 36rem);
  overflow-y: auto;
}

.upload_csv__button-text {
  color: var(--red);
  text-decoration: underline;
}
</style>
