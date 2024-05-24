<script setup lang="ts">
import { useHomeSuggestionsStore } from "~/stores/home/suggestions";

const homeSuggestionsStore = useHomeSuggestionsStore();
const { suggestions } = storeToRefs(homeSuggestionsStore);
</script>

<template>
  <Popup
    height="10rem"
    width="calc(100vw - 2rem - 1rem - 2rem - 400px)"
    class="suggestions-container"
  >
    <SuggestionsGroup
      v-for="(group, index) in suggestions"
      :key="index"
      :group="group"
      :number="index"
    />
  </Popup>
</template>

<style scoped lang="scss">
.suggestions-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  overflow-y: auto;
  margin-right: 2rem;
}
</style>
