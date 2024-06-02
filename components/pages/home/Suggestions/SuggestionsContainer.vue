<script setup lang="ts">
import { useHomeSuggestionsStore } from "~/stores/home/suggestions";

const homeSuggestionsStore = useHomeSuggestionsStore();
const { suggestions, hideSuggestions } = storeToRefs(homeSuggestionsStore);

const toggleHideSuggestions = () => {
  hideSuggestions.value = !hideSuggestions.value;
};

const resetSuggestions = () => {
  homeSuggestionsStore.reset();
};

const [noPassengers, groups] = partition(
  suggestions.value,
  (group) => group.passengers.length === 0,
);

const [unassigned, soloDrivers] = partition(
  noPassengers,
  (group) => group.capacity === 0,
);
</script>

<template>
  <Popup class="suggestions__container">
    <div class="controls">
      <Icon
        fill="var(--purple)"
        size="16px"
        name="eraser"
        @click="resetSuggestions"
      />
      <Icon
        fill="var(--purple)"
        size="16px"
        name="arrow-down"
        :style="{
          transform: hideSuggestions ? 'rotate(180deg)' : 'rotate(0deg)',
        }"
        @click="toggleHideSuggestions"
      />
    </div>
    <ul class="suggestions__list">
      <SuggestionsUnassigned v-if="unassigned.length" :groups="unassigned" />
      <SuggestionsGroup
        v-for="(group, index) in groups"
        :key="index"
        :group="group"
        :number="index"
      />
      <SuggestionsSoloDrivers v-if="soloDrivers.length" :groups="soloDrivers" />
    </ul>
  </Popup>
</template>

<style scoped lang="scss">
.suggestions__container {
  display: flex;
  flex-direction: row-reverse;
  margin-right: 2rem;
  padding: 1rem 0;
  width: calc(fit-content(100%) + 2rem);
  max-width: calc(100vw - 2rem - 1rem - 2rem - 400px);
  height: 14rem;

  .controls {
    margin: 0 1rem;
    display: flex;
    gap: 0.5rem;
    > * {
      cursor: pointer;
      flex-shrink: 0;
    }
  }
  .suggestions__list {
    display: flex;
    align-items: flex-start;
    justify-content: start;
    flex-wrap: wrap;
    overflow-y: auto;
    height: 12rem;
    row-gap: 1rem;
  }
}
</style>
