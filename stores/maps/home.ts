import { defineStore } from "pinia";
import type { Location } from "~/types/Location";

export const useHomeMapStore = defineStore("homeMap", () => {
  const destinationLocation = ref<Location | null>(null);
  const carpoolLocations = ref<Location[]>([]);

  return {
    destinationLocation,
    carpoolLocations,
  };
});
