<script setup lang="ts">
import { useHomeSuggestionsStore } from "~/stores/home/suggestions";

const homeSuggestionsStore = useHomeSuggestionsStore();
const { suggestions } = storeToRefs(homeSuggestionsStore);
</script>

<template>
  <Popup
    height="10rem"
    width="calc(100vw - 2rem - 1rem - 400px)"
    class="flex flex-col content-center justify-start overflow-y-auto"
  >
    <SuggestionsGroup
      v-for="(group, index) in suggestions"
      :key="index"
      :group="group"
      :number="index"
    />
  </Popup>
</template>

<style scoped lang="scss"></style>
