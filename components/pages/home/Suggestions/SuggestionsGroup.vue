<script setup lang="ts">
import type { LngLatLike } from "mapbox-gl";

const props = defineProps<{
  group: SuggestionGroup;
  number: number;
}>();

const homeMapStore = useHomeMapStore();
const { carpoolLocations } = storeToRefs(homeMapStore);

const getPersonFromId = (id: string) => {
  const person = carpoolLocations.value.find((location) => location.id === id);
  console.log(person, "person");
  return person;
};

const showWarning = computed(() => {
  return props.group.passengers.length + 1 > props.group.capacity;
});
</script>

<template>
  <li class="group">
    <div class="flex flex-wrap justify-between content-end">
      <div class="text-lg font-semibold">Car {{ number + 1 }}</div>
      <div
        class="text-sm flex content-end h-3.5"
        :class="{
          warning: showWarning,
        }"
      >
        {{ group.passengers.length + 1 }}
        <Icon
          :fill="showWarning ? 'var(--red)' : 'var(--purple)'"
          size="16px"
          name="person-standing"
        />
        / {{ group.capacity }}
        <Icon size="16px" name="seats" fill="none" />
      </div>
    </div>
    <div class="group__subtitle">
      <Icon fill="var(--green)" size="16px" name="car" />
      <span class="font-medium">Driver: </span>
    </div>
    <LocationLabel
      :name="getPersonFromId(group.driver)?.name"
      :place="getPersonFromId(group.driver)?.place"
      :car-seats="group.capacity"
      :coordinates="getPersonFromId(group.driver)?.coordinates"
    />
    <div class="group__subtitle">
      <Icon fill="var(--green)" size="16px" name="person-standing" />
      <span class="font-medium">Passengers:</span>
    </div>
    <div v-if="!group.passengers.length" class="subtle italic">
      No passengers
    </div>
    <ul v-else>
      <li v-for="person in group.passengers" :key="person">
        <LocationLabel
          :name="getPersonFromId(person)?.name"
          :place="getPersonFromId(person)?.place"
          :car-seats="group.capacity"
          :coordinates="getPersonFromId(person)?.coordinates"
        />
      </li>
    </ul>
  </li>
</template>

<style scoped lang="scss">
.group {
  width: 17rem;
  padding: 0.5rem 1rem;
  height: 100%;
  &:not(:last-child) {
    border-right: 1px solid var(--lavender);
  }
  .warning {
    color: var(--red);
  }
  .group__subtitle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0 0.25rem 0;
  }
}
</style>
