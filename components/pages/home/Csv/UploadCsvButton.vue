<script setup lang="ts">
import Papa from "papaparse";

const homeCsvStore = useHomeCsvStore();

const handleFileUpload = (event: Event) => {
  const uploadedFile = (event.target as HTMLInputElement).files?.[0] || null;

  if (!uploadedFile) {
    return;
  }

  Papa.parse(uploadedFile, {
    header: true,
    skipEmptyLines: true,
    complete: (results: any) => {
      homeCsvStore.$patch({
        headers: results.meta.fields,
        rows: results.data,
        showColumnPopup: true,
      });
    },
  });
};
</script>

<template>
  <div>
    <label class="flex flex-col items-center cursor-pointer">
      <input
        type="file"
        accept=".csv"
        name="upload_csv"
        class="hidden"
        @click="$event.target.value = ''"
        @change="handleFileUpload"
      />
      <Icon fill="var(--lavender)" size="48px" name="upload" />
      <div variant="tertiary" class="upload_csv__button-text">Upload CSV</div>
    </label>
  </div>
</template>

<style>
.upload_csv__button-text {
  color: var(--red);
  text-decoration: underline;
}
</style>
