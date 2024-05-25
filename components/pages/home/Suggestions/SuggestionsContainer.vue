<script setup lang="ts">
import { useHomeSuggestionsStore } from "~/stores/home/suggestions";

const homeSuggestionsStore = useHomeSuggestionsStore();
const { suggestions } = storeToRefs(homeSuggestionsStore);
</script>

<template>
  <Popup class="suggestions__container">
    <ul class="suggestions__list">
      <SuggestionsGroup
        v-for="(group, index) in suggestions"
        :key="index"
        :group="group"
        :number="index"
      />
    </ul>
  </Popup>
</template>

<style scoped lang="scss">
.suggestions__container {
  margin-right: 2rem;
  padding: 1rem 0;
  width: fit-content;
  max-width: calc(100vw - 2rem - 1rem - 2rem - 400px);
  height: fit-content;
  max-height: 15rem;
  .suggestions__list {
    display: flex;
    align-items: flex-start;
    justify-content: start;
    flex-wrap: wrap;
    overflow-y: auto;
    height: fit-content;
    row-gap: 1rem;
  }
}
</style>
