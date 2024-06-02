<script setup lang="ts">
const props = defineProps<{
  group: SuggestionGroup;
  number: number;
}>();

const homeMapStore = useHomeMapStore();
const { carpoolLocations } = storeToRefs(homeMapStore);

const getPersonFromId = (id: string) => {
  const person = carpoolLocations.value.find((location) => location.id === id);
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
        {{ group.passengers.length + 1 }} x
        <Icon
          :fill="showWarning ? 'var(--red)' : 'var(--purple)'"
          size="16px"
          name="person-standing"
        />
        / {{ group.capacity }} x
        <Icon size="16px" name="seats" fill="var(--purple)" />
      </div>
    </div>
    <div class="group__subtitle">
      <Icon fill="var(--green)" size="16px" name="car" />
      <span class="font-medium">Driver: </span>
    </div>
    <div>
      {{
        getPersonFromId(group.driver)?.name ??
        getPersonFromId(group.driver)?.place
      }}
    </div>
    <div class="group__subtitle">
      <Icon fill="var(--green)" size="16px" name="person-standing" />
      <span class="font-medium">Passengers:</span>
    </div>
    <div v-if="!group.passengers.length" class="subtle italic">
      No passengers
    </div>
    <ul v-else>
      <li v-for="person in group.passengers" :key="person">
        {{ getPersonFromId(person)?.name ?? getPersonFromId(person)?.place }}
      </li>
    </ul>
  </li>
</template>

<style scoped lang="scss">
.group {
  width: 15rem;
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
