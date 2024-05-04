<script setup lang="ts">
const homeMapStore = useHomeMapStore();
const { suggestions, routes, carpoolLocations } = storeToRefs(homeMapStore);

const maxRows = computed(() => {
  return Math.max(...suggestions.value.map((suggestion) => suggestion.length));
});

const cellLabel = (routeId: string) => {
  if (!routeId) return "";
  const carpoolId = routes.value.find(
    (route) => route.id === routeId,
  )?.carpoolId;

  if (!carpoolId) {
    return "Something went wrong";
  }
  return (
    carpoolLocations.value.find((location) => location.id === carpoolId)
      ?.label ?? "Location not found"
  );
};
</script>

<template>
  <div>
    <div>Suggestions for carpool:</div>
    <table>
      <thead>
        <tr>
          <th v-for="(suggestion, index) in suggestions" :key="index">
            Group {{ index + 1 }} ({{ suggestion.length }})
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in maxRows" :key="rowIndex">
          <td v-for="(suggestion, index) in suggestions" :key="index">
            {{ cellLabel(suggestion[rowIndex]) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  text-align: center;
  border-collapse: collapse;
  border: 1px solid var(--neutral-900);
  margin: 1rem 0;
}

th {
  border: 1px solid var(--neutral-900);
  background-color: var(--neutral-500);
  padding: 0.25rem;
}

td {
  border-right: 1px solid var(--neutral-900);
  border-left: 1px solid var(--neutral-900);
  padding: 0.25rem;
}
</style>
