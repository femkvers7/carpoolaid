<script setup lang="ts">
import type { Location } from "~/types/Location";

const props = defineProps({
  location: {
    type: Object as PropType<Location>,
    required: true,
  },
});

const emit = defineEmits(["editLocation"]);

const homeMapStore = useHomeMapStore();
const { carpoolLocations, routes } = storeToRefs(homeMapStore);

const homeFormStore = useHomeFormStore();

const deleteLocation = (e: Event) => {
  e.preventDefault();

  homeFormStore.deleteLocation(props.location.id);

  homeMapStore.updateMapData(["markers", "routes"]);
};

const toggleEditLocation = () => {
  homeFormStore.onEdit(props.location);
};
</script>

<template>
  <div class="flex justify-between items-center mt-1">
    <p class="flex items-center gap-2">
      {{ location.name ?? location.address.place }}
      <span v-if="location.carSeats">
        - {{ location.carSeats }} x
        <Icon
          fill="none"
          size="16px"
          width="25"
          height="16"
          name="seats"
          class="block"
      /></span>
    </p>
    <div class="flex gap-3 items-center">
      <Button variant="neutral" @click="toggleEditLocation">
        <Icon fill="var(--purple)" size="16px" name="pencil-square" />
      </Button>
      <Button variant="neutral" @click="deleteLocation">
        <Icon fill="var(--purple)" size="16px" name="cross" />
      </Button>
    </div>
  </div>
</template>
