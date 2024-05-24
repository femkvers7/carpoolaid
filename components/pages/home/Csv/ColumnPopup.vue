<script setup lang="ts">
const homeCsvStore = useHomeCsvStore();
const {
  headers,
  showColumnPopup,
  showPreviewPopup,
  columnNames,
  columnChecks,
} = storeToRefs(homeCsvStore);

const toggleCheck = (type: string) => {
  //columnChecks.value[type] = !columnChecks.value[type];

  if (columnChecks.value[type]) {
    if (type === "shift") {
      columnNames.value.startTime = "";
      columnNames.value.endTime = "";
    } else {
      columnNames.value[type] = "";
    }
  }
};

const handleClickNext = () => {
  // save this new information to the store

  showColumnPopup.value = false;
  showPreviewPopup.value = true;
};
</script>

<template>
  <div class="backdrop">
    <Popup class="column-popup" width="40rem" height="fit-content">
      <Icon
        fill="var(--purple)"
        size="16px"
        name="cross"
        class="absolute top-4 right-4 cursor-pointer"
        @click="$emit('close')"
      />
      <h3>Please indicate which information is included in the file</h3>
      <p class="subtle mt-1 mb-3">
        Columns with the following names are auto-imported: <br />
        Country, City, Postcode*, Street, Address_number
      </p>

      <div class="column-selectors">
        <div>
          <label>
            <input
              v-model="columnChecks.name"
              type="checkbox"
              name="name"
              @click="toggleCheck('name')"
            />
            Includes name:
          </label>
          <select
            id="tag-column"
            v-model="columnNames.name"
            name="tag-column"
            :disabled="!columnChecks.name"
          >
            <option value="">Select a column</option>
            <option
              v-for="(header, index) in headers"
              :key="index"
              :value="header"
            >
              {{ header }}
            </option>
          </select>
        </div>
        <div>
          <label>
            <input
              v-model="columnChecks.shift"
              type="checkbox"
              name="shift"
              @click="toggleCheck('shift')"
            />
            Includes shift times:
          </label>
          <div class="flex gap-2">
            <select
              id="start-column"
              v-model="columnNames.startTime"
              name="start-column"
              :disabled="!columnChecks.shift"
            >
              <option value="">Start</option>
              <option
                v-for="(header, index) in headers"
                :key="index"
                :value="header"
              >
                {{ header }}
              </option>
            </select>
            <select
              id="end-column"
              v-model="columnNames.endTime"
              name="end-column"
              :disabled="!columnChecks.shift"
            >
              <option value="">End</option>
              <option
                v-for="(header, index) in headers"
                :key="index"
                :value="header"
              >
                {{ header }}
              </option>
            </select>
          </div>
        </div>
        <div>
          <label>
            <input
              v-model="columnChecks.carAvailability"
              type="checkbox"
              name="car"
              @click="toggleCheck('carAvailability')"
            />
            Includes car availabilities:
          </label>
          <select
            id="car-column"
            v-model="columnNames.carAvailability"
            name="car-column"
            :disabled="!columnChecks.carAvailability"
          >
            <option value="">Select a column</option>
            <option
              v-for="(header, index) in headers"
              :key="index"
              :value="header"
            >
              {{ header }}
            </option>
          </select>
        </div>
      </div>
      <Button class="ml-auto my-3" @click="handleClickNext">Next</Button>
      <p class="subtle required">* Required</p>
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
.column-popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;

  text-align: center;
}

.column-selectors {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  & > * {
    display: flex;
    justify-content: space-between;

    select {
      width: 12rem;
      padding: 0.25rem 0.5rem;
      background-color: var(--beige);
      border-radius: 0.5rem;
    }
  }
}

.subtle {
  font-size: 0.75rem;
  line-height: 1.2;
}
.required {
  text-align: end;
}
</style>
