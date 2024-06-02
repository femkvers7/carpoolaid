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
  <li class="unassigned">
    <div class="text-lg font-semibold title">
      Unassigned <span class="no-car">(no car)</span>
    </div>
    <ul>
      <li v-for="group in groups" :key="group.id">
        <LocationLabel
          :name="getPersonFromId(group.driver)?.name"
          :place="getPersonFromId(group.driver)?.place"
          :car-seats="group.capacity"
        />
      </li>
    </ul>
  </li>
</template>

<style lang="scss" scoped>
.unassigned {
  width: 15rem;
  padding: 0.5rem 1rem;
  height: 100%;
  &:not(:last-child) {
    border-right: 1px solid var(--lavender);
  }
}

.title {
  color: var(--red);

  .no-car {
    color: var(--purple);
    font-weight: normal;
    font-size: medium;
  }
}
</style>
