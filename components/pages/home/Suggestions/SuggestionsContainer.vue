<script setup lang="ts">
import { useHomeSuggestionsStore } from "~/stores/home/suggestions";

const homeSuggestionsStore = useHomeSuggestionsStore();
const { suggestions, hideSuggestions } = storeToRefs(homeSuggestionsStore);

const toggleHideSuggestions = () => {
  hideSuggestions.value = !hideSuggestions.value;
};
</script>

<template>
  <Popup class="suggestions__container">
    <Icon
      fill="var(--purple)"
      size="16px"
      name="arrow-down"
      class="suggestions__hide"
      :style="{
        transform: hideSuggestions ? 'rotate(180deg)' : 'rotate(0deg)',
      }"
      @click="toggleHideSuggestions"
    />
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
  display: flex;
  flex-direction: row-reverse;
  margin-right: 2rem;
  padding: 1rem 0;
  width: calc(fit-content(100%) + 2rem);
  max-width: calc(100vw - 2rem - 1rem - 2rem - 400px);
  height: 14rem;

  .suggestions__hide {
    cursor: pointer;
    margin: 0 1rem;
    flex-shrink: 0;
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
