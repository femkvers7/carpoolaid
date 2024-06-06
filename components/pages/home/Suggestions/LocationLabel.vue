<script setup lang="ts">
import type { LngLatLike } from "mapbox-gl";

const props = defineProps<{
  name?: string;
  place?: string;
  carSeats?: number;
  coordinates?: number[];
}>();

const isHovering = ref(false);

const homeMapStore = useHomeMapStore();

const handleLocationHover = () => {
  isHovering.value = true;
  console.log(props.coordinates);
  homeMapStore.setPopup(
    props.coordinates as LngLatLike,
    `
      <h2>${props.place}</h2>
      <p>${props.name ?? ""}</p>
    `,
  );
};

const handleLocationLeave = () => {
  isHovering.value = false;
  homeMapStore.removePopup();
};
</script>

<template>
  <div
    class="location-label"
    :class="{
      'font-bold': isHovering,
    }"
    @mouseover="handleLocationHover"
    @mouseleave="handleLocationLeave"
  >
    <div>
      <span>{{ name }}</span>
      <span v-if="name && place" class="mx-1"> - </span>
      <span class="italic">{{ place }}</span>
    </div>
    <div class="seats" :class="{ noSeats: !carSeats }">
      {{ carSeats ?? "0" }}
      <Icon
        fill="none"
        size="16px"
        width="25"
        height="16"
        name="seats"
        class="block"
      />
    </div>
  </div>
</template>

<style>
.location-label {
  font-size: 14px;
  display: flex;
  justify-content: space-between;
}

.seats {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.noSeats {
  color: var(--red);
}
</style>
