export const useHomeCsvStore = defineStore("homeCsv", () => {
  const headers = ref<string[]>([]);
  const rows = ref<{ [key: string]: string }[]>([]);

  const showColumnPopup = ref<boolean>(false);
  const showPreviewPopup = ref<boolean>(false);

  const columnChecks = ref<{ [keys: string]: boolean }>({
    name: false,
    shift: false,
    carAvailability: false,
  });

  const columnNames = ref<{ [keys: string]: any }>({
    country: "Country",
    city: "City",
    postcode: "Postcode",
    street: "Street",
    address_number: "Address Number",
    name: "",
    startTime: "",
    endTime: "",
    carAvailability: "",
  });

  const previewColumns = computed(() => {
    return getPresentColumnNames(rows.value, columnNames.value);
  });

  const reset = () => {
    headers.value = [];
    rows.value = [];
    columnChecks.value = {
      name: false,
      shift: false,
      carAvailability: false,
    };
    columnNames.value = {
      country: "Country",
      city: "City",
      postcode: "Postcode",
      street: "Street",
      address_number: "Address Number",
      name: "",
      startTime: "",
      endTime: "",
      carAvailability: "",
    };
  };

  return {
    headers,
    rows,
    showColumnPopup,
    showPreviewPopup,
    columnChecks,
    columnNames,
    previewColumns,
    reset,
  };
});

function getPresentColumnNames(
  data: { [key: string]: string }[],
  columnNames: { [keys: string]: any },
) {
  const presentColumns: { [keys: string]: any } = {};

  Object.keys(columnNames).forEach((key) => {
    const columnName = columnNames[key];
    if (
      columnName &&
      data.some((row) => row[columnName] && row[columnName].trim())
    ) {
      presentColumns[key] = columnName;
    }
  });

  return presentColumns;
}
