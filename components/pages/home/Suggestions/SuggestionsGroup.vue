<script setup lang="ts">
const props = defineProps<{
  group: string[];
  number: number;
}>();

const localGroup = ref(props.group);

const homeMapStore = useHomeMapStore();
const { destinationLocation, carpoolLocations, routes } =
  storeToRefs(homeMapStore);

// must be the first or second person, bc they were assigned first to the group
const driverId = computed(() => {
  if (props.group.length === 1) {
    localGroup.value = [];
    return props.group[0];
  }
  const distances = props.group.slice(0, 2).map((person) => {
    return routes.value.find((route) => route.carpoolId === person)?.distance;
  });

  console.log(distances);

  const maxDistanceIndex = distances.indexOf(Math.max(...distances));

  console.log(maxDistanceIndex);
  console.log(props.group[maxDistanceIndex]);
  localGroup.value = localGroup.value.filter(
    (person) => person !== props.group[maxDistanceIndex],
  );

  return props.group[maxDistanceIndex];
});

const getPersonFromId = (id: string) => {
  const person = carpoolLocations.value.find((location) => location.id === id);
  console.log(person);
  return person;
};
</script>

<template>
  <div>
    <div class="text-lg">Car {{ number + 1 }}</div>
    <div>
      <Icon fill="var(--purple)" size="16px" name="car" />
      Driver:
      {{
        getPersonFromId(driverId)?.name ??
        getPersonFromId(driverId)?.label ??
        getPersonFromId(driverId)?.address.place
      }}
    </div>
    <div>Passengers:</div>
    <ul>
      <li v-for="person in localGroup" :key="person">
        {{
          getPersonFromId(person)?.name ??
          getPersonFromId(person)?.label ??
          getPersonFromId(person)?.address.place
        }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss"></style>
