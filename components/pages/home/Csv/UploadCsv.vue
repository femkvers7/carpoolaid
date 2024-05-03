<script setup lang="ts">
import Papa from "papaparse";

const homeMapStore = useHomeMapStore();
const { destinationLocation } = storeToRefs(homeMapStore);

const handleFileUpload = (event: Event) => {
  const uploadedFile = (event.target as HTMLInputElement).files?.[0] || null;

  if (!uploadedFile) {
    return;
  }

  Papa.parse(uploadedFile, {
    header: true,
    skipEmptyLines: true,
    complete: async (results: any) => {
      console.log(results, "results from csv upload");

      const carpoolBody = results.data.map((result: any) => {
        return {
          place: result["Place"],
          postcode: result["Postcode"],
          street: result["Street"],
          address_number: result["Address_number"],
          country: result["Country"],
          limit: 1,
        };
      });

      console.log(carpoolBody, "carpoolBody");

      const result = await $fetch("/api/batch-geocode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: carpoolBody,
      });

      console.log(result, "result from custom api call");

      homeMapStore.$patch({
        carpoolLocations: result,
      });

      // update routes
      if (destinationLocation.value) {
        homeMapStore.updateRoutes();
      }
      homeMapStore.updateMapData(["markers", "routes"]);
    },
  });
};
</script>

<template>
  <div class="excel-input__wrapper">
    <p v-if="!destinationLocation">
      <i>Please select a destination before uploading a file</i>
    </p>
    <input
      type="file"
      accept=".csv"
      :disabled="!destinationLocation"
      @change="handleFileUpload"
    />
  </div>
</template>

<style>
.excel-input__wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 1rem auto;
}
</style>
