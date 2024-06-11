<script setup lang="ts">
import type { LngLatLike } from "mapbox-gl";
import type { Location } from "~/types/Location";

const props = defineProps({
  location: {
    type: Object as PropType<Location>,
    required: true,
  },
});

defineEmits(["editLocation"]);

const isHovering = ref(false);

const indexStore = useIndexStore();
const { isLoading } = storeToRefs(indexStore);

const homeMapStore = useHomeMapStore();

const homeFormStore = useHomeFormStore();
const { formValues, isEditing } = storeToRefs(homeFormStore);

const deleteLocation = () => {
  isLoading.value = true;

  homeFormStore.deleteLocation(props.location.id);
  homeMapStore.updateMapData(["markers", "routes"]);

  isLoading.value = false;
};

const toggleEditLocation = () => {
  isLoading.value = true;
  isEditing.value = props.location.id;
  formValues.value = props.location;

  const mapInput = document.getElementById(
    "location-input",
  ) as HTMLInputElement;
  mapInput.value = props.location.fullAddress ?? props.location.place ?? "";
  isLoading.value = false;
};

const handleAddressHover = () => {
  isHovering.value = true;
  homeMapStore.setPopup(
    props.location.coordinates as LngLatLike,
    `
      <h2>${props.location.place}</h2>
      <p>${props.location.name ?? ""} ${props.location.name ? " - " : ""} ${props.location.carSeats ? `${props.location.carSeats}` : ""}</p>
    `,
  );
};

/**
 * <div>
          <h2>${title}</h2>
          <p>${description} ${type === "carpool" ? `${description ? " - " : ""} ${carSeats ? `${carSeats}` : "0"}` : ""}</p>
        </div>
 */

const handleAddressLeave = () => {
  isHovering.value = false;
  homeMapStore.removePopup();
};
</script>

<template>
  <div class="flex justify-between items-center mt-1">
    <p
      class="flex items-center"
      :class="{
        'font-bold': isHovering,
      }"
      :style="{
        color: isEditing === location.id ? 'var(--green)' : 'var(--purple)',
      }"
      @mouseover="handleAddressHover"
      @mouseleave="handleAddressLeave"
    >
      <span>{{ location.name }}</span>
      <span v-if="location.name && location.place" class="mx-3">-</span>
      <span class="italic">{{ location.place }}</span>
    </p>
    <div class="flex gap-3 items-center">
      <div v-if="location.carSeats" class="seats">
        {{ location.carSeats }}
        <Icon
          fill="none"
          size="16px"
          width="25"
          height="16"
          name="seats"
          class="block"
        />
      </div>
      <Button variant="neutral" @click.prevent="toggleEditLocation">
        <Icon fill="var(--purple)" size="16px" name="pencil-square" />
      </Button>
      <Button variant="neutral" @click.prevent="deleteLocation">
        <Icon fill="var(--purple)" size="16px" name="cross" />
      </Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.seats {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--green);
  margin-right: 0.25rem;
}
</style>
