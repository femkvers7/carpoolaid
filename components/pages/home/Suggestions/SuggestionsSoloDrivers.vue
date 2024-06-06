<script setup lang="ts">
import type { SuggestionGroup } from "~/types/Suggestion.ts";

const props = defineProps<{
  groups: SuggestionGroup[];
}>();

const homeMapStore = useHomeMapStore();
const { carpoolLocations } = storeToRefs(homeMapStore);

const getPersonFromId = (id: string) => {
  const person = carpoolLocations.value.find((location) => location.id === id);
  return person;
};
</script>

<template>
  <li class="solo-drivers">
    <div class="text-lg font-semibold title">Solo drivers</div>
    <ul>
      <li v-for="group in groups" :key="group.id">
        <LocationLabel
          :name="getPersonFromId(group.driver)?.name"
          :place="getPersonFromId(group.driver)?.place"
          :car-seats="group.capacity"
          :coordinates="getPersonFromId(group.driver)?.coordinates"
        />
      </li>
    </ul>
  </li>
</template>

<style scoped lang="scss">
.solo-drivers {
  width: 17rem;
  padding: 0.5rem 1rem;
  height: 100%;
  &:not(:last-child) {
    border-right: 1px solid var(--lavender);
  }
}
</style>
