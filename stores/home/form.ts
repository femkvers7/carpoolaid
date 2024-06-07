import type { Location } from "~/types/Location";

export const useHomeFormStore = defineStore("homeForm", () => {
  const homeMapStore = useHomeMapStore();
  const { carpoolLocations, routes } = storeToRefs(homeMapStore);

  const emptyForm = {
    name: undefined,
    carSeats: 4,
  };

  type EmptyForm = typeof emptyForm;

  const formValues = ref<Location | EmptyForm>(emptyForm);
  const isEditing = ref<string | null>(null);

  const resetForm = () => {
    formValues.value = emptyForm;
    const mapInput = document.getElementById(
      "location-input",
    ) as HTMLInputElement;
    mapInput.value = "";
  };

  const deleteLocation = (locationId: string) => {
    carpoolLocations.value = carpoolLocations.value.filter(
      (loc) => loc.id !== locationId,
    );

    routes.value = routes.value.filter(
      (route: Route) => route.carpoolId !== locationId,
    );
  };

  return {
    formValues,
    isEditing,
    resetForm,
    deleteLocation,
  };
});
