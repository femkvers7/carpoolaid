<script setup lang="ts">
const homeMapStore = useHomeMapStore();
const { suggestions } = storeToRefs(homeMapStore);
</script>

<template>
  <div>
    <div class="flex flex-col justify-center items-center mb-4">
      <h1>CarpoolAid</h1>
      <p class="intro">Your helper for arranging group carpools!</p>
    </div>
    <div class="flex flex-col items-center w-full">
      <p>Enter destination and carpool addresses here</p>
      <AddressForm class="w-full" />
      <p class="italic">Or</p>
      <p>Upload a CSV file</p>
      <UploadCsv />
    </div>
    <SuggestionsTable v-if="suggestions.length" />
    <!--<PreviewTable v-if="showPreviewTable" />-->
    <MapTraditional class="map" />
  </div>
</template>

<style lang="scss">
.map {
  display: block;
  width: 100%;
  aspect-ratio: 16/9;
  margin-bottom: 5rem;
  position: relative;
}
</style>
