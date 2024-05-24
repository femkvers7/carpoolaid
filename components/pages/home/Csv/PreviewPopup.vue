<script setup lang="ts">
import type { Location, MapboxLocation } from "~/types/Location";

const csvStore = useHomeCsvStore();
const { showColumnPopup, showPreviewPopup, previewColumns, rows } =
  storeToRefs(csvStore);

const homeMapStore = useHomeMapStore();
const { destinationLocation, carpoolLocations } = storeToRefs(homeMapStore);

const preview = rows.value.slice(0, 5);

const postcodeWarning = computed(() => {
  // checks if postcode column is present and if there are any empty values
  return (
    !previewColumns.value.postcode ||
    rows.value.some((entry) => !entry.Postcode || entry.Postcode.trim() === "")
  );
});

const rowsLeft = computed(() => {
  if (rows.value.length > 5) {
    return rows.value.length - 5;
  }
  return 0;
});

const handleClickNext = async () => {
  const carpoolBody = rows.value.map((row) => {
    return {
      place: row["City"],
      postcode: row["Postcode"],
      street: row["Street"],
      address_number: row["Address_number"],
      country: row["Country"],
      limit: 1,
    };
  });

  const result = await $fetch("/api/batch-geocode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: carpoolBody,
  });

  const data = await result;
  const extendedData = ref(data);

  if (previewColumns.value.name || previewColumns.value.carAvailability) {
    extendedData.value = data.map((entry: Location, index: number) => {
      const newEntry = entry;
      if (
        previewColumns.value.name &&
        rows.value[index][previewColumns.value.name]
      ) {
        newEntry.name = rows.value[index][previewColumns.value.name];
      }

      if (previewColumns.value.carAvailability) {
        const carSeats = parseInt(
          rows.value[index][previewColumns.value.carAvailability],
        );
        newEntry.carSeats = Object.is(carSeats, NaN) ? 0 : carSeats;
      }

      // add shift times here as well

      return newEntry;
    });
  }

  carpoolLocations.value = extendedData.value;

  // update routes
  if (destinationLocation.value) {
    await homeMapStore.updateRoutes();
    homeMapStore.updateMapData(["markers", "routes"]);
  } else homeMapStore.updateMapData(["markers"]);

  showPreviewPopup.value = false;
};

const handleClickBack = () => {
  showPreviewPopup.value = false;
  showColumnPopup.value = true;
};
</script>

<template>
  <div class="backdrop">
    <Popup class="preview-popup" width="40rem" height="fit-content">
      <Icon
        fill="var(--purple)"
        size="16px"
        name="cross"
        class="absolute top-4 right-4 cursor-pointer"
        @click="$emit('close')"
      />
      <h3>Preview</h3>

      <div class="relative overflow-x-auto">
        <div class="overlay"></div>
        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead class="text-xs text-gray-700 uppercase">
            <tr>
              <th
                v-for="(value, key) in previewColumns"
                :key="key"
                class="px-2 py-2"
              >
                {{ value }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in preview"
              :key="index"
              class="bg-transparent border-b"
            >
              <td
                v-for="(column, key) in previewColumns"
                :key="key"
                class="px-3 py-3"
              >
                {{ row[column] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="rowsLeft" class="more-rows">{{ rowsLeft }} more rows ...</div>
      <div v-if="postcodeWarning" class="warning mt-4">
        We notice that some rows are lacking a postcode <br />
        It is strongly recommended to provide a postal code to avoid ambiguity.
      </div>
      <div class="flex flex-row justify-between my-3">
        <Button @click="handleClickBack">Back</Button>
        <Button @click="handleClickNext">Next</Button>
      </div>
    </Popup>
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 101;
}

.overlay {
  background: var(--white);
  background: linear-gradient(
    0deg,
    var(--white) 0%,
    rgba(255, 255, 255, 0) 29%
  );
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.preview-popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;

  text-align: center;

  .more-rows {
    font-size: 0.85rem;
    line-height: 1.2;
    text-align: start;
    margin-left: 0.75rem;
    margin-top: 1rem;
  }
  .warning {
    color: var(--red);
    font-size: 0.85rem;
    line-height: 1.2;
  }
}
</style>
