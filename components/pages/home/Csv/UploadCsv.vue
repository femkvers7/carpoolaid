<script setup lang="ts">
import Papa from "papaparse";

const csvStore = useHomeCsvStore();
const { csvData, csvHeaders, csvParsedFile } = storeToRefs(csvStore);
const homeMapStore = useHomeMapStore();
const { carpoolLocations, destinationLocation } = storeToRefs(homeMapStore);
const MAPBOX_API_KEY = useRuntimeConfig().public.mapboxAccessToken;

const handleFileUpload = (event: Event) => {
  const uploadedFile = (event.target as HTMLInputElement).files?.[0] || null;

  if (!uploadedFile) {
    return;
  }

  Papa.parse(uploadedFile, {
    header: true,
    skipEmptyLines: true,
    complete: (results: any) => {
      console.log(results, "results from upload");
      csvData.value = results.data;
      csvHeaders.value = results.meta.fields;
      csvParsedFile.value = results;

      // we'll have to geocode the results and save them in the map store
      geocodeData(results.data);
    },
  });
};

const geocodeData = async (results: any) => {
  const requestBody = results.map((result: any) => {
    return {
      q: result["Woonplaats"],
      limit: 1,
      language: "nl",
    };
  });

  console.log(requestBody, "request body for geocoding");

  const url = `https://api.mapbox.com/search/geocode/v6/batch?access_token=${MAPBOX_API_KEY}`;

  const query = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const result = await query.json();
  console.log(result, "result from geocoding");

  // save the results in the map store
  const formattedResult = result.batch.map((res: any) => {
    return {
      coordinates: res.features[0].geometry.coordinates,
      full_address: res.features[0].properties.full_address,
      context: res.features[0].context,
    };
  });
  console.log(formattedResult, "formatted result to save in store");
  carpoolLocations.value = formattedResult;

  // update routes
  if (destinationLocation.value) {
    homeMapStore.updateRoutes();
  }
  homeMapStore.updateMapData(["markers", "routes"]);
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
