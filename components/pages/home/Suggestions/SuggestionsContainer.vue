<script setup lang="ts">
import { useHomeSuggestionsStore } from "~/stores/home/suggestions";

const homeSuggestionsStore = useHomeSuggestionsStore();
const { suggestions, hideSuggestions } = storeToRefs(homeSuggestionsStore);

const homeMapStore = useHomeMapStore();
const { carpoolLocations } = storeToRefs(homeMapStore);

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

const getPersonFromId = (id: string) => {
  const person = carpoolLocations.value.find((location) => location.id === id);
  return person;
};

/** Source: https://www.youtube.com/watch?v=uxK1UVcMOOo & copilot **/
const convertToCSV = (
  unassigned: SuggestionGroup[],
  groups: SuggestionGroup[],
  soloDrivers: SuggestionGroup[],
) => {
  const headers = ["Name", "Address", "Type", "Car Capacity", "GroupNr"];
  const rows = [
    ...unassigned.map((group, index) => {
      const driver = getPersonFromId(group.driver);
      return [
        driver?.name,
        `"${driver?.fullAddress}"`,
        "UNASSIGNED",
        group.capacity,
        null,
      ];
    }),
    ...groups.flatMap((group, index) => {
      const driver = getPersonFromId(group.driver);
      const passengers = group.passengers;
      return [
        [
          driver?.name,
          `"${driver?.fullAddress}"`,
          "driver",
          group.capacity,
          index + 1,
        ],
        ...passengers.map((passenger) => {
          const person = getPersonFromId(passenger);
          return [
            person?.name,
            `"${person?.fullAddress}"`,
            "carpool",
            person?.carSeats,
            index + 1,
          ];
        }),
      ];
    }),
    ...soloDrivers.map((group, index) => {
      const driver = getPersonFromId(group.driver);
      return [
        driver?.name,
        `"${driver?.fullAddress}"`,
        "solo",
        group.capacity,
        index + 1 + groups.length,
      ];
    }),
  ];

  const csvRows = [headers.join(","), ...rows.map((row) => row.join(","))].join(
    "\n",
  );

  return csvRows;
};

const exportDataToCsv = (csvRows: string) => {
  const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", "carpool.csv");
  a.click();
};

const handleDownload = () => {
  const csvRows = convertToCSV(unassigned, groups, soloDrivers);
  exportDataToCsv(csvRows);
};
/** *************************************************************** **/
</script>

<template>
  <Popup class="suggestions__container">
    <div class="controls">
      <Icon
        size="16px"
        name="eye"
        :style="{
          fill: hideSuggestions ? 'var(--lavender)' : 'var(--purple)',
        }"
        @click="toggleHideSuggestions"
      />
      <Icon
        fill="var(--purple)"
        size="16px"
        name="eraser"
        @click="resetSuggestions"
      />
      <Icon
        fill="var(--purple)"
        size="16px"
        name="download"
        @click="handleDownload"
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
  height: 14rem;

  .controls {
    margin: 0 1rem;
    display: flex;
    flex-direction: column;
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
