<script setup lang="ts">
const dataTypes = [
  {
    value: "name",
    label: "Name",
    assignedColumn: "",
  },
  {
    value: "address",
    label: "Address",
    assignedColumn: "",
  },
  {
    value: "shiftStart",
    label: "Start Shift",
    assignedColumn: "",
  },
  {
    value: "shiftEnd",
    label: "EndShift",
    assignedColumn: "",
  },
  {
    value: "carAvailable",
    label: "Car Available",
    assignedColumn: "",
  },
];

const csvStore = useHomeCsvStore();
const { csvData, csvHeaders } = storeToRefs(csvStore);
</script>

<template>
  <div class="table-wrapper">
    <p>
      Please select which of your data columns correspond to the types below
    </p>
    <table>
      <tr>
        <th v-for="(type, index) in dataTypes" :key="index">
          {{ type.label }}
        </th>
      </tr>
      <tr>
        <th v-for="(type, index) in dataTypes" :key="index">
          <select>
            <option>Not applicable</option>
            <option v-for="(header, index) in csvHeaders" :key="index">
              {{ header }}
            </option>
          </select>
        </th>
      </tr>
      <tr v-for="(item, index) in csvData" :key="index">
        <th>
          {{ item.assignedColumn }}
        </th>
      </tr>
    </table>
  </div>
</template>

<style scoped>
.table-wrapper {
  width: 100%;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ccc;
  padding: 10px;
  width: 20%;
}

select {
  width: 100%;
}
</style>
