export const useHomeCsvStore = defineStore("homeCsv", () => {
  /* Temp - tbs if we need these, remove if not */
  const csvUploadedFile = ref<File | null>(null);
  const csvParsedFile = ref<Object | null>(null);
  /* ^^ */
  const csvData = ref<Object[]>([]);
  const csvHeaders = ref<string[]>([]);

  return {
    csvData,
    csvHeaders,
    csvUploadedFile,
    csvParsedFile,
  };
});
